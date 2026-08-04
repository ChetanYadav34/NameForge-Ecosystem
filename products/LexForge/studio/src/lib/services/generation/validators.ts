import { GenerationRequestDTO } from "./dto";
import { ValidationError } from "./errors";

export class GenerationRequestValidator {
  validate(dto: GenerationRequestDTO): void {
    if (!dto.seed || typeof dto.seed !== "string" || dto.seed.trim() === "") {
      throw new ValidationError("Seed must be a non-empty string");
    }

    if (!dto.objective || typeof dto.objective !== "string" || dto.objective.trim() === "") {
      throw new ValidationError("Objective must be a non-empty string");
    }

    if (dto.priority !== undefined) {
      if (typeof dto.priority !== "number" || dto.priority < 0 || dto.priority > 100) {
        throw new ValidationError("Priority must be a number between 0 and 100");
      }
    }
  }
}

export const requestValidator = new GenerationRequestValidator();
