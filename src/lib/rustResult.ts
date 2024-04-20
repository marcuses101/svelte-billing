export type Ok<T> = { ok: true; value: T; error?: never };
export type Err<E> = { ok: false; value?: never; error: E };
export type Result<T, E = unknown> = Ok<T> | Err<E>;

export function wrapOk<T>(input: T): Ok<T> {
	return { ok: true, value: input };
}
export function wrapErr<E = unknown>(error: E): Err<E> {
	return { ok: false, error };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeSafe<TArgs extends any[], TReturn>(
	func: (...args: TArgs) => TReturn
): (...args: TArgs) => Promise<Ok<Awaited<TReturn>> | Err<unknown>> {
	return async (...args: TArgs) => {
		try {
			const value = await func(...args);
			return wrapOk(value);
		} catch (e) {
			return wrapErr(e);
		}
	};
}
