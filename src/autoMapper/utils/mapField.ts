import {forMember, mapFrom, Selector} from "@automapper/core";
import {Dictionary, MappingConfiguration, SelectorReturn} from "@automapper/core/lib/types";

export function mapField<
  Source extends Dictionary<Source>,
  Destination extends Dictionary<Destination>,
  TMemberType = SelectorReturn<Source>,
  TMemberType2 = SelectorReturn<Destination>,
  TransformType extends (arg: TMemberType) => TMemberType2 = (arg: TMemberType) => TMemberType2,
>(
  sourceSelector: Selector<Source, TMemberType>,
  destinationSelector: Selector<Destination, TMemberType2>,
  transformFn: TransformType,
): MappingConfiguration<Source, Destination> {
  return forMember<Source, Destination, TMemberType2 | undefined>(
    destinationSelector,
    mapFrom(x => {
      const sourceValue = sourceSelector(x);

      return typeof sourceValue === 'undefined' ? undefined : transformFn(sourceValue);
    }),
  )
}
