import { genSaltSync, hashSync } from 'bcrypt';
import envConfiguration, { env } from 'configs/env.configuration';
export const createHashPassword = async (password: string): Promise<string> => {
    const saltRounds = env.jwt.SALT_ROUNDS;
    const salt = genSaltSync(Number(saltRounds));
    const hash = await hashSync(password, salt);
    return hash;
}