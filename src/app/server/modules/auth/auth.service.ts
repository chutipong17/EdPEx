import { customLog } from "@/app/server/util/custom-log";
import { Auth, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import { HTTPException } from "hono/http-exception";
import { signAccessToken, verifyAccessToken } from "../../config/jwt";
import prismaInstance from "../../config/prismaClientInstance";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { SignInDto } from "../../dto/sign-in.dto";
import { SignUpDto } from "../../dto/sign-up.dto";
import { Permission, Role } from "../../enum/enum";
import { calculateTokenExpiryDate } from "../../util/common";
import { RoleRepository } from "../role/role.repository";
import { UserRepository } from "../user/user.repository";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  private readonly prisma = prismaInstance;
  private readonly TOKEN_EXPIRY = 24 * 60 * 60; // 1 day in seconds
  private readonly ROE_PERMISSION: Record<number, number[]> = {
    [Role.ADMIN]: [Permission.CAN_CREATE, Permission.CAN_VIEW, Permission.CAN_EDIT, Permission.CAN_DELETE],
    [Role.USER]: [Permission.CAN_CREATE, Permission.CAN_VIEW],
    [Role.EXECUTIVE]: [Permission.CAN_VIEW],
  };

  constructor(
    private readonly authRepository = new AuthRepository(),
    private readonly userRepository = new UserRepository(),
    private readonly roleRepository = new RoleRepository(),
  ) {}

  async getAuth(): Promise<Auth> {
    try {
      customLog.info("Getting auth service");
      return this.authRepository.getAuth();
    } catch (error) {
      customLog.error("Error getting auth", { error });
      throw new Error("auth failed");
    }
  }

  async signUp(signUpDto: SignUpDto, userId: number) {
    try {
      customLog.info("Signing up user");

      const existingUser = await this.userRepository.findUserByEmail(signUpDto.email);
      if (existingUser) {
        customLog.error("มีผู้ใช้รายนี้ในระบบแล้ว");
        throw new HTTPException(400, { message: "มีผู้ใช้รายนี้ในระบบแล้ว" });
      }

      const hashedPassword = await argon2.hash(signUpDto.password, {
        type: argon2.argon2id,
      });

      const adminUser =
        signUpDto.role === Role.ADMIN
          ? null
          : await this.userRepository.findUserById(userId);

      const fullName =
        signUpDto.role === Role.ADMIN
          ? "system"
          : [adminUser?.firstName, adminUser?.lastName]
              .filter(Boolean)
              .join(" ");

      const userData: Prisma.UserCreateInput = {
        email: signUpDto.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName || undefined,
        mobileNumber: signUpDto.mobileNumber || undefined,
        isDeleted: false,
        isActive: true,
        createdBy: adminUser ? fullName : "system",
        updatedBy: adminUser ? fullName : "system",
      };

      if (signUpDto.role !== Role.ADMIN) {
        userData.department = {
          connect: { id: signUpDto.department },
        };
      }

      customLog.info("User data", { userData });

      const user = await this.prisma.$transaction(async (tx) => {
        const createdUser = await this.userRepository.createUserTransaction(tx, userData);

        const permissions = this.ROE_PERMISSION[signUpDto.role] ?? [];
        const rolePermissionData: Prisma.RolePermissionCreateManyInput[] =
          permissions.map((permissionId) => ({
            roleId: signUpDto.role,
            permissionId,
            userId: createdUser.id,
            isDeleted: false,
            createdBy: adminUser ? fullName : "system",
            updatedBy: adminUser ? fullName : "system",
          }));
        customLog.info("Role permission data", { rolePermissionData });
        await this.roleRepository.createRolePermissionTransaction(tx, rolePermissionData);

        const authData: Prisma.AuthCreateInput = {
          username: signUpDto.userName,
          user: {
            connect: { id: createdUser.id },
          },
          password: hashedPassword,
          isDeleted: false,
          createdBy: adminUser ? fullName : "system",
          updatedBy: adminUser ? fullName : "system",
        };

        customLog.info("Auth data", { authData });

        await this.authRepository.createAuthTransaction(tx, authData);

        return createdUser;
      },
      {
        timeout: 10000, // Set a timeout of 10 seconds for the transaction
        maxWait: 2000, // Set a maximum wait time of 2 seconds for acquiring a connection
      });

      return user;

    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error signing up user: ", { message: `${error}` || "Sign up failed" });
      throw new HTTPException(status, { message: `${error}` || "Sign up failed" });
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      customLog.info("Signing in user");

      const auth = await this.authRepository.findAuthByUserName(signInDto.userName);
      if (!auth) {
        customLog.error("User not found.");
        throw new HTTPException(400, { message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }

      const isPasswordMatched = await argon2.verify(
          auth.password,
          signInDto.password
      );

      if (!isPasswordMatched) {
        customLog.error("Invalid username or password.");
        throw new HTTPException(400, { message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }

      if (auth.isDeleted === true || 
          auth.user.isActive === false || 
          auth.user.isDeleted === true
      ) {
        customLog.error("Account is deactivated or deleted.");
        throw new HTTPException(400, { message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }

      const tokenExpiry = calculateTokenExpiryDate(this.TOKEN_EXPIRY);

      const token = signAccessToken({
        sub: auth.userId.toString(),
        email: auth.user.email,
        roleId: auth.user.rolePermission[0]?.roleId || 0,
        fullName: [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" "),
      });

      await this.authRepository.createOrUpdateRefreshToken(
        auth.userId,
        token,
        tokenExpiry
      );

      return {
        token,
        expiresAt: tokenExpiry,
        user: auth.user,
      };
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error signing in user: ", { message: `${error}` || "Sign in failed" });
      throw new HTTPException(status, { message: `${error}` || "Sign in failed" });
    }
  }

  async signOut(token: string): Promise<void> {
    try {
      customLog.info("Signing out user");
      const payload = verifyAccessToken(token);
      await this.authRepository.deleteRefreshToken(Number(payload.sub));
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error signing out user: ", { message: `${error}` || "Sign out failed" });
      throw new HTTPException(status, { message: `${error}` || "Sign out failed" });
    }
  }

  async changePassword(request: ChangePasswordDto, token: string) {
    try {
      customLog.info("Changing user password");
      if (request.password !== request.confirmPassword) {
        customLog.error("รหัสผ่านไม่ตรงกัน");
        throw new HTTPException(400, { message: "รหัสผ่านไม่ตรงกัน" });
      }

      // Verify and extract payload from token
      const payload = verifyAccessToken(token);
      customLog.info("Token payload", { payload });
      
      // Condition checks for payload
      if (!payload) {
        throw new HTTPException(401, { message: "Invalid or expired token" });
      }

      const userId = request.userId;
      const fullName = payload.fullName;

      // Hash and update new password
      const hashedPassword = await argon2.hash(request.password, {
        type: argon2.argon2id,
      });

      const updatedAuth = await this.authRepository.updateAuth(
        hashedPassword,
        fullName,
        userId
      );

      customLog.info("Password changed successfully for user: ", { userId });
      return updatedAuth;
    } catch (error) {
      const status = error instanceof HTTPException ? error.status : 500;
      customLog.error("Error changing user password: ", { message: `${error}` || "Changing user password failed" });
      throw new HTTPException(status, { message: `${error}` || "Changing user password failed" });
    }
  }
}