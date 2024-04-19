import { v1, v4 } from 'uuid';
import { createHash } from 'crypto';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Protocol } from 'src/dtos/protocol-dto';

export const generateToken = () => v1().concat(v4()).replaceAll('-', '');

export const generateUUID = () => v4().replaceAll('-', '');

export const md5 = (str: string) =>
  createHash('md5').update(str, 'utf-8').digest('hex');

export const isProtocol = (obj: unknown): obj is Protocol => {
  if (typeof obj !== 'object') return false;
  if (obj === null) return false;
  if (Array.isArray(obj)) return false;
  const pack = obj as Protocol;
  if (typeof pack.passport !== 'string') return false;
  if (typeof pack.session !== 'string') return false;
  if (typeof pack.resource !== 'object') return false;
  if (typeof pack.sign !== 'string') return false;
  if (typeof pack.other !== 'object') return false;
  return true;
};

export const serializeInstance = <T>(object: T) => {
  return JSON.stringify(instanceToPlain(object));
};

export const deserializeInstance = <T>(
  cls: ClassConstructor<T>,
  plain: string,
) => {
  return plainToInstance(cls, JSON.parse(plain));
};

export const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};
