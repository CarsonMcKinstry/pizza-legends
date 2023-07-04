interface GlobalEventDefinitions {
  PersonWalkingComplete: {
    whoId?: string;
  };
  PersonStandComplete: {
    whoId?: string;
  };
}

export type GlobalEventHandler<Type extends keyof GlobalEventDefinitions> = (
  event: CustomEvent<GlobalEventDefinitions[Type]>
) => void;

class GlobalEvents {
  emit<
    Name extends keyof GlobalEventDefinitions,
    Details extends GlobalEventDefinitions[Name]
  >(name: Name, details: Details) {
    this.emitEvent<Details>(name, details);
  }

  private emitEvent<Details>(type: string, detail: Details) {
    const event = new CustomEvent<Details>(type, {
      detail,
    });

    document.dispatchEvent(event);
  }

  on<
    Name extends keyof GlobalEventDefinitions,
    Details extends GlobalEventDefinitions[Name]
  >(name: Name, callback: (event: CustomEvent<Details>) => void) {
    document.addEventListener(name, callback as (event: Event) => void);
  }

  off<
    Name extends keyof GlobalEventDefinitions,
    Details extends GlobalEventDefinitions[Name]
  >(name: Name, callback: (event: CustomEvent<Details>) => void) {
    document.removeEventListener(name, callback as (event: Event) => void);
  }
}

export const globalEvents = new GlobalEvents();
