import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useClubStore } from '../store/clubStore';
import { Button, Confetti } from '../components/UI';

export default function Chosen() {
  const { round, choosePlayer } = useClubStore(); const nav=useNavigate(); const [show,setShow]=useState(false);
  useEffect(()=>{if(round&&!round.chosenPlayerId){choosePlayer();setTimeout(()=>setShow(true),1600);}else setShow(true);},[choosePlayer,round]);
  if(!round)return null;
  const next=()=>{const stage=round.optionalRules.cards.enabled?'abilities':round.optionalRules.randomCategory.enabled?'theme':'nominations';nav(`/${stage}`);};
  return <div className="chosen center-step"><Confetti/><p className="eyebrow">FASE 3 · O ESCOLHIDO</p><motion.div animate={{rotate:show?0:360}} transition={{duration:1.5}} className="chosen-die">🎲</motion.div><p className="eyebrow">O ESCOLHIDO É...</p><h1>{show?round.chosenPlayerName:'???'}</h1>{show&&<><div className="chosen-badge">{round.optionalRules.cards.enabled?'Seu poder será a carta escolhida':'Seu voto vale 2 pontos nesta rodada'}</div><Button onClick={next}>Continuar <span>→</span></Button></>}</div>;
}
