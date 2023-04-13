import {Selector} from "@automapper/core";
import {Dictionary, MappingConfiguration, SelectorReturn} from "@automapper/core/lib/types";
import {reflect, ReflectedProperty} from "typescript-rtti";
import {getAutoMappingConfiguration} from "./getAutoMappingConfiguration";

export function autoField<
  Source,
  Destination,
  SourceDictionary extends Dictionary<Source> = Dictionary<Source>,
  DestinationDictionary extends Dictionary<Destination> = Dictionary<Destination>,
  TMemberType = SelectorReturn<SourceDictionary>,
  TMemberType2 = SelectorReturn<DestinationDictionary>,
>(
  sourceProp: Selector<Source, TMemberType>,
  destinationProp: Selector<Destination, TMemberType2>,
): MappingConfiguration<Source, Destination> | undefined {
  let sourceType: ReflectedProperty['type'] = reflect(sourceProp).returnType;
  let destType: ReflectedProperty['type'] = reflect(destinationProp).returnType;

  return getAutoMappingConfiguration(sourceType, destType, sourceProp, destinationProp);
}
