import { ProjectStatus } from "./project.enum";

export class ProjectDto {
  readonly idProject?: number; // Ubah agar opsional
  readonly projectName: string;
  startDate?: string;
  endDate?: string;
  projectDesc?: string;
  status?: ProjectStatus; // Tambahkan tanda ? untuk opsional
}
