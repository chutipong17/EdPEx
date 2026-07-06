import { customLog } from "@/app/server/util/custom-log";
import { Role } from "@prisma/client";
import { RoleRepository } from "./role.repository";

export class RoleService {
  constructor(private readonly roleRepository = new RoleRepository()) {}

  async getRole(): Promise<Role[]> {
    try {
      customLog.info("Getting role service");
      return this.roleRepository.getRole();
    } catch (error) {
      customLog.error("Error getting role", { error });
      throw new Error("role failed");
    }
  }
}