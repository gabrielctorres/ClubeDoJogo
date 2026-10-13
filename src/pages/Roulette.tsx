import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { useClubStore } from '../store/clubStore';
import { Button, Card } from '../components/UI';
import type { GameEntry } from '../types';

const colors = ['#7357e8','#ffc84a','#3fcda1','#ff7190','#5bb8ef','#ff9d5c','#b879e8','#42c6d4','#ef6f42','#8bc34a'];
const point=(angle:number,radius:number)=>{const r=(angle-90)*Math.PI/180;return[100+radius*Math.cos(r),100+radius*Math.sin(r)] as const;};
const slicePath=(start:number,end:number)=>{const[x1,y1]=point(start,82);const[x2,y2]=point(end,82);return`M 100 100 L ${x1} ${y1} A 82 82 0 ${end-start>180?1:0} 1 ${x2} ${y2} Z`;};
export function PieWheel({games,spinning}:{games:GameEntry[];spinning:boolean}) {
  const total = games.reduce((sum, game) => sum + Math.max(game.finalScore, 0), 0);
  let angle = 0;
  return <div className={`pie-wheel-wrap ${spinning?'spinning':''}`}>
    <div className="pointer">▼</div>
    <svg className="pie-wheel" viewBox="0 0 200 200" role="img" aria-label="Roleta com os nomes dos jogos">
      {games.map((game, index) => {
        const sweep = total ? Math.max(game.finalScore, 0) / total * 360 : 360 / games.length;
        const start = angle;
        angle += sweep;
        if (!sweep) return null;
        const middle = start + sweep / 2;
        const [x, y] = point(middle, 53);
        const rotation = middle - 90 + (middle > 180 ? 180 : 0);
        const letters = Array.from(game.name);
        const name = letters.length > 10 ? `${letters.slice(0, 9).join('')}…` : game.name;
        return <g key={game.id}>
          <title>{game.name}</title>
          {sweep >= 359.999
            ? <circle cx="100" cy="100" r="82" fill={colors[index%colors.length]} stroke="#fff8ed" strokeWidth="1.5"/>
            : <path d={slicePath(start, angle)} fill={colors[index%colors.length]} stroke="#fff8ed" strokeWidth="1.5"/>}
          {sweep >= 16 && <text x={x} y={y} transform={`rotate(${rotation} ${x} ${y})`} className="pie-name" fontSize="7" textAnchor="middle" dominantBaseline="middle">{name}</text>}
        </g>;
      })}
      <circle cx="100" cy="100" r="21" fill="#fff"/>
      <text x="100" y="101" textAnchor="middle" dominantBaseline="middle" className="pie-center">🎲</text>
    </svg>
  </div>;
}
export default function Roulette(){const{round,spinWinner}=useClubStore();const nav=useNavigate();const[spinning,setSpinning]=useState(false);if(!round)return null;return <div className="center-step"><p className="eyebrow">FASE 10 · ROLETA FINAL</p><h2>Agora a sorte decide</h2><p>Cada fatia representa um jogo. A pontuação define o tamanho dela.</p><Card className="roulette"><PieWheel games={round.games} spinning={spinning}/><div className="odds">{round.games.map((g,index)=><div key={g.id}><span className="legend"><i style={{background:colors[index%colors.length]}}/>{g.name}</span></div>)}</div></Card><Button disabled={spinning} onClick={()=>{setSpinning(true);spinWinner();setTimeout(()=>nav('/winner'),2200)}}><RotateCw size={20}/> {spinning?'Girando...':'GIRAR ROLETA'}</Button></div>;}
