import {Selector} from "@automapper/core";
import {Dictionary, MappingConfiguration, SelectorReturn} from "@automapper/core/lib/types";
import {ReflectedProperty} from "typescript-rtti";
import {getTransformFn} from "./getTransformFn";
import {mapField} from "./mapField";
import {mapNested} from "./mapNested";

export function getAutoMappingConfiguration<
  Source,
  Destination,
  SourceDictionary extends Dictionary<Source> = Dictionary<Source>,
  DestinationDictionary extends Dictionary<Destination> = Dictionary<Destination>,
  TMemberType = SelectorReturn<SourceDictionary>,
  TMemberType2 = SelectorReturn<DestinationDictionary>,
>(
  sourceType: ReflectedProperty['type'],
  destType: ReflectedProperty['type'],
  sourceProp: Selector<Source, TMemberType>,
  destinationProp: Selector<Destination, TMemberType2>,
): MappingConfiguration<Source, Destination> | undefined {
  if (sourceType.equals(destType)) {
    return mapField<Source, Destination>(sourceProp, destinationProp, x => x);
  }

  const transformFn = getTransformFn(destType);

  if (transformFn) {
    return mapField<Source, Destination>(sourceProp, destinationProp, transformFn);
  }

  if (sourceType.isUnion()) {
    sourceType = sourceType.as('union').types.filter(x => !x.isUndefined())[0];
  }

  if (destType.isUnion()) {
    destType = destType.as('union').types.filter(x => !x.isUndefined())[0];
  }

  if (sourceType.isClass() && destType.isClass()) {
    // @ts-ignore
    return mapNested([sourceType._ref, sourceProp], [destType._ref, destinationProp]);
  } else if (sourceType.isArray() && destType.isArray()) {
    // @ts-ignore
    return mapNested([sourceType.elementType._ref, sourceProp], [destType.elementType._ref, destinationProp]);
  }
}
