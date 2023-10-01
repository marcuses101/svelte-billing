export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = unknown> = Ok<T> | Err<E>;

export function wrapOk<T>(input: T): Ok<T> {
	return { ok: true, value: input };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeSafe<TArgs extends any[], TReturn>(
	func: (...args: TArgs) => TReturn
): (...args: TArgs) => Result<TReturn> {
	return (...args: TArgs) => {
		try {
			return {
				ok: true,
				value: func(...args)
			};
		} catch (e) {
			return {
				ok: false,
				error: e
			};
		}
	};
}
