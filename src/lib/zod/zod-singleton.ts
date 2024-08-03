import { lazySingleton } from "@/lib/utils/singleton";
import { ZodType } from "zod";

export class ZodSingleton<T> {
  private zodType;
  private configSingleton;

  constructor(zodType: ZodType<T>, env?: Partial<T>) {
    this.zodType = zodType;
    this.configSingleton = lazySingleton(() => {
      if (env) {
        return this.validate(env);
      } else {
        return this.validate(process.env);
      }
    });
  }

  get(): T {
    return this.configSingleton.get();
  }

  private validate(env: unknown): T {
    return this.zodType.parse(env);
  }
}
