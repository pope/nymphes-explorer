class AssertionError extends Error {
	constructor(msg: string) {
		super(msg);
	}
}

export function assert(
	condition: unknown,
	msg = 'Assertion condition failed'
): asserts condition {
	if (!condition) {
		throw new AssertionError(msg);
	}
}

export function assertExists<T>(
	val: T,
	msg = 'Value expected to not be null or undefined'
): asserts val is NonNullable<T> {
	assert(val != null, msg);
}

export function assertNever(val: never): never {
	throw new AssertionError(`Unhandled union member: ${JSON.stringify(val)}`);
}
