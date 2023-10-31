import { ProjectStatus } from "./project.enum";

export class ProjectDto {
  readonly idProject?: number; // Ubah agar opsional
  readonly projectName: string;
  dueDate?: string;
  projectDesc?: string;
  status?: ProjectStatus; // Tambahkan tanda ? untuk opsional
}
