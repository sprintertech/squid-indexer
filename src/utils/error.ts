/*
The Licensed Work is (c) 2024 Sygma
SPDX-License-Identifier: LGPL-3.0-only
*/
export class SkipNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SkipNotFoundError";
  }
}