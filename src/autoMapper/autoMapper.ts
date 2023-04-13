import {classes} from "@automapper/classes";
import {AnyConstructor, createMap, createMapper, Mapper, Selector} from "@automapper/core";
import {MappingConfiguration, ModelIdentifier} from "@automapper/core/lib/types";
import {CallSite, reflect, ReflectedCallSite, ReflectedClass} from "typescript-rtti";
import {getAutoMappingConfiguration} from "./utils/getAutoMappingConfiguration";

export class AutoMapper {
  private readonly mapper: Mapper;

  constructor() {
    this.mapper = createMapper({
      strategyInitializer: classes(),
    });
  }

  map<DestinationType>(obj: unknown, call?: CallSite): DestinationType {
    const callSite: ReflectedCallSite = reflect(call as CallSite);
    // @ts-ignore
    const fromType: AnyConstructor = (reflect(obj) as ReflectedClass).class;
    // @ts-ignore
    const toType: AnyConstructor = callSite.typeParameters[0]._ref;

    return this.mapper.map(obj, fromType, toType);
  }

  addProfile<
    Source,
    Destination,
    SMI extends ModelIdentifier<Source> = ModelIdentifier<Source>,
    DMI extends ModelIdentifier<Destination> = ModelIdentifier<Destination>,
  >(a: SMI, b: DMI, additionalMapping?: (MappingConfiguration<Source, Destination> | undefined)[], additionalReverseMapping?: (MappingConfiguration<Destination, Source> | undefined)[]) {
    // @ts-ignore
    const label = `Auto mapping ${a.name} to ${b.name}`;
    console.group(label);
    const aProperties = reflect(a).properties;
    const bProperties = reflect(b).properties;
    const mapping: MappingConfiguration<Source, Destination>[] = [];
    const mappingReverse: MappingConfiguration<Destination, Source>[] = [];

    for (const aProperty of aProperties) {
      // @ts-ignore
      let selectorA: Selector<Source> = x => x[aProperty.name];
      // @ts-ignore
      let selectorB: Selector<Destination> = x => x[bProperty.name];

      const bProperty = bProperties.find(x => x.name === aProperty.name);

      if (!bProperty) {
        continue;
      }

      const label2 = `Auto mapping property ${aProperty.name} to ${bProperty.name}`;
      console.log(label2);

      const autoMap = getAutoMappingConfiguration<Source, Destination>(aProperty.type, bProperty.type, selectorA, selectorB);
      const autoMapReverse = getAutoMappingConfiguration<Destination, Source>(bProperty.type, aProperty.type, selectorB, selectorA);

      if (autoMap && autoMapReverse) {
        mapping.push(autoMap);
        mappingReverse.push(autoMapReverse);
      }
    }

    if (additionalMapping) {
      mapping.push(...(additionalMapping.filter(x => x) as MappingConfiguration<Source, Destination>[]));
    }

    if (additionalReverseMapping) {
      mappingReverse.push(...additionalReverseMapping.filter(x => x) as MappingConfiguration<Destination, Source>[]);
    }


    console.log(`Source mapping: ${mapping.length}/${aProperties.length}`);
    console.log(`Destination mapping: ${mappingReverse.length}/${bProperties.length}`);

    if (mapping.length > aProperties.length) {
      throw new Error(`Source mapping is greater than source properties`);
    }

    if (mappingReverse.length > bProperties.length) {
      throw new Error(`Destination mapping is greater than destination properties`);
    }

    createMap<Source, Destination>(this.mapper, a, b, ...mapping);
    createMap<Destination, Source>(this.mapper, b, a, ...mappingReverse);
    console.groupEnd();
  }
}
