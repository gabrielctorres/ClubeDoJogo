import { useCallback } from 'react';
import { useClubStore } from '../store/clubStore';
import { getNextStage } from '../services/stageFlow';

/** Avança a rodada para a próxima etapa ativa. A navegação fica a cargo do `StageRoute`. */
export function useAdvanceStage() {
  const setStage = useClubStore(s => s.setStage);
  return useCallback(() => {
    const round = useClubStore.getState().round;
    const next = round && getNextStage(round);
    if (next) setStage(next);
  }, [setStage]);
}
