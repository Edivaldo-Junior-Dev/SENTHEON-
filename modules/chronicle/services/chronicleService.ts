
import { ChronicleEvent, EventType, ModuleName } from "../../../types";
import { analyzeEvent } from "./aiAnalyzer";
import { useSystemStore, useChronicleStore } from "../../../core/store";

class ChronicleService {
  constructor() {
    this.init();
  }

  private async init() {
    await useChronicleStore.getState().fetchEvents();
    const events = useChronicleStore.getState().events;
    
    if (events.length === 0) {
      this.recordEvent(
        EventType.CREATED,
        ModuleName.SETTINGS,
        'SYS_CORE',
        null,
        { version: '1.0.0', status: 'ONLINE' },
        'SENTHEON v4.0',
        'Kernel'
      );
    }
    useSystemStore.getState().calculateDynamicVersion(events);
  }

  public getEvents(): ChronicleEvent[] {
    return useChronicleStore.getState().events;
  }

  public async recordEvent(
    type: EventType,
    module: ModuleName,
    entityId: string,
    before: any,
    after: any,
    entityName?: string,
    actorName: string = 'Usuário'
  ): Promise<ChronicleEvent> {
    
    const event: ChronicleEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      module,
      entityId,
      entityName,
      actor: { type: 'user', name: actorName },
      snapshot: { before, after }
    };

    await useChronicleStore.getState().addEvent(event);
    
    // Recalcula versão no store
    useSystemStore.getState().calculateDynamicVersion(useChronicleStore.getState().events);

    analyzeEvent(event).then(async (analysis) => {
      const allEvents = useChronicleStore.getState().events;
      const index = allEvents.findIndex(e => e.id === event.id);
      if (index !== -1) {
        const updatedEvent = { ...allEvents[index], aiAnalysis: analysis };
        // No Supabase precisaríamos de um updateEvent no store se quiséssemos persistir a análise depois
        // Por simplicidade, assumimos que o recordEvent inicial já basta ou faremos uma nova persistência.
      }
    });

    return event;
  }

  public clearHistory() {
    useChronicleStore.getState().clearEvents();
  }
}

export const chronicleService = new ChronicleService();
