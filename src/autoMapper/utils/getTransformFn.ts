import {ReflectedProperty} from "typescript-rtti";

export function getTransformFn(reflectedTypeRef: ReflectedProperty['type']): ((x: unknown) => any) | undefined {
  if (reflectedTypeRef.isClass(Number) || reflectedTypeRef.isNumberLiteral()) {
    return x => Number(x);
  } else if (reflectedTypeRef.isClass(String) || reflectedTypeRef.isStringLiteral()) {
    return x => String(x);
  } else if (reflectedTypeRef.isClass(Boolean) || reflectedTypeRef.isBooleanLiteral()) {
    return x => Boolean(x);
  } else if (reflectedTypeRef.isClass(Date)) {
    return x => new Date(x as any);
  }
  return undefined;
}
