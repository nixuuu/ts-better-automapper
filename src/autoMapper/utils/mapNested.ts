import {forMember, mapWith, Selector} from "@automapper/core";
import {Dictionary, MappingConfiguration, ModelIdentifier, SelectorReturn} from "@automapper/core/lib/types";

export function mapNested<
  Source,
  Destination,
  WithDestination extends Dictionary<WithDestination>,
  WithSource extends Dictionary<WithSource>,
  DestinationModelIdentifier extends ModelIdentifier<WithDestination>,
  SourceModelIdentifier extends ModelIdentifier<WithSource>,
  TMemberType = SelectorReturn<Selector<Source>>,
  TMemberType2 = SelectorReturn<Selector<Destination>>,
>(
  [sourceType, sourceSelector]: [SourceModelIdentifier, Selector<Source, TMemberType>],
  [destinationType, destinationSelector]: [DestinationModelIdentifier, Selector<Destination, TMemberType2>],
): MappingConfiguration<Source, Destination> {
  return forMember<Source, Destination>(destinationSelector, mapWith(destinationType, sourceType, sourceSelector));
}
