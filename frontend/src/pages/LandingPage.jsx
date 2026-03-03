import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  MdAccountBalance, MdDocumentScanner, MdTrackChanges,
  MdStar, MdFavorite, MdTrendingUp, MdSecurity,
  MdSpeed, MdSmartphone, MdCheck, MdArrowForward,
  MdEmail, MdPhone, MdLocationOn, MdNotifications
} from 'react-icons/md'
import logo from '../assets/logo.svg'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'

function HeroDashboardVector() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="greenLine" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="redLine" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      
      <rect x="40" y="20" width="340" height="240" rx="20" fill="url(#cardGrad)" filter="url(#shadow)" />

     
      <rect x="40" y="20" width="340" height="52" rx="20" fill="rgba(255,255,255,0.06)" />
      <rect x="40" y="52" width="340" height="20" fill="rgba(255,255,255,0.06)" />

      
      <circle cx="68" cy="46" r="12" fill="#3B82F6" />
      <circle cx="68" cy="46" r="6" fill="rgba(255,255,255,0.4)" />
      <rect x="88" y="38" width="80" height="7" rx="3.5" fill="rgba(255,255,255,0.6)" />
      <rect x="88" y="49" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />

     
      <rect x="334" y="34" width="36" height="20" rx="10" fill="rgba(16,185,129,0.2)" />
      <rect x="340" y="40" width="24" height="8" rx="4" fill="rgba(16,185,129,0.7)" />

     
      <rect x="60" y="88" width="60" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="60" y="100" width="140" height="18" rx="5" fill="rgba(255,255,255,0.85)" />
      <rect x="60" y="124" width="80" height="6" rx="3" fill="rgba(16,185,129,0.6)" />

     
      <polygon points="220,185 255,165 280,170 310,148 340,140 370,125 370,210 220,210"
        fill="url(#areaGrad)" />
      <polyline points="220,185 255,165 280,170 310,148 340,140 370,125"
        stroke="url(#greenLine)" strokeWidth="2.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
      {[220,255,280,310,340,370].map((x, i) => {
        const ys = [185,165,170,148,140,125]
        return <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="white" stroke="#10B981" strokeWidth="1.5" />
      })}

      
      <rect x="60" y="160" width="140" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="160" width="95" height="6" rx="3" fill="#3B82F6" />
      <rect x="60" y="174" width="140" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="174" width="112" height="6" rx="3" fill="#10B981" />
      <rect x="60" y="188" width="140" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="188" width="60" height="6" rx="3" fill="#F59E0B" />

      
      {[0,1,2,3,4,5].map(i => {
        const heights = [28,40,32,50,38,45]
        const x = 60 + i * 26
        return (
          <rect key={i} x={x} y={230 - heights[i]} width="16" height={heights[i]}
            rx="4" fill={i === 3 || i === 5 ? 'url(#barGrad)' : 'rgba(255,255,255,0.15)'} />
        )
      })}
      <rect x="60" y="232" width="200" height="1" fill="rgba(255,255,255,0.1)" />

     
      <rect x="300" y="180" width="148" height="80" rx="16" fill="white" filter="url(#cardShadow)">
        <animate attributeName="y" values="180;168;180" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <circle cx="324" cy="204" r="12" fill="#D1FAE5">
        <animate attributeName="cy" values="204;192;204" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <rect x="342" y="197" width="40" height="6" rx="3" fill="#E5E7EB">
        <animate attributeName="y" values="197;185;197" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="342" y="208" width="60" height="9" rx="3" fill="#111827">
        <animate attributeName="y" values="208;196;208" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="316" y="224" width="80" height="6" rx="3" fill="#10B981">
        <animate attributeName="y" values="224;212;224" dur="3.5s" repeatCount="indefinite" />
      </rect>
      
      <polygon points="321,208 327,208 324,202" fill="#10B981">
        <animate attributeName="points"
          values="321,208 327,208 324,202; 321,196 327,196 324,190; 321,208 327,208 324,202"
          dur="3.5s" repeatCount="indefinite" />
      </polygon>

      
      <rect x="0" y="160" width="148" height="80" rx="16" fill="white" filter="url(#cardShadow)">
        <animate attributeName="y" values="160;172;160" dur="4s" repeatCount="indefinite" />
      </rect>
      <circle cx="24" cy="184" r="12" fill="#FEE2E2">
        <animate attributeName="cy" values="184;196;184" dur="4s" repeatCount="indefinite" />
      </circle>
      <rect x="42" y="177" width="40" height="6" rx="3" fill="#E5E7EB">
        <animate attributeName="y" values="177;189;177" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="42" y="188" width="60" height="9" rx="3" fill="#111827">
        <animate attributeName="y" values="188;200;188" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="205" width="100" height="5" rx="2.5" fill="#F3F4F6">
        <animate attributeName="y" values="205;217;205" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="205" width="64" height="5" rx="2.5" fill="#EF4444">
        <animate attributeName="y" values="205;217;205" dur="4s" repeatCount="indefinite" />
      </rect>

      
      <rect x="340" y="280" width="110" height="64" rx="16" fill="white" filter="url(#cardShadow)">
        <animate attributeName="y" values="280;268;280" dur="5s" repeatCount="indefinite" />
      </rect>
      <circle cx="367" cy="309" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3">
        <animate attributeName="cy" values="309;297;309" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="367" cy="309" r="16" fill="none" stroke="#10B981" strokeWidth="3"
        strokeDasharray="60" strokeDashoffset="18"
        transform="rotate(-90 367 309)" strokeLinecap="round">
        <animate attributeName="cy" values="309;297;309" dur="5s" repeatCount="indefinite" />
      </circle>
      <rect x="389" y="300" width="35" height="6" rx="3" fill="#E5E7EB">
        <animate attributeName="y" values="300;288;300" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="389" y="311" width="48" height="9" rx="3" fill="#111827">
        <animate attributeName="y" values="311;299;311" dur="5s" repeatCount="indefinite" />
      </rect>

    
      <rect x="20" y="280" width="130" height="72" rx="16" fill="white" filter="url(#cardShadow)">
        <animate attributeName="y" values="280;292;280" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="36" y="294" width="34" height="42" rx="6" fill="#EFF6FF">
        <animate attributeName="y" values="294;306;294" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="298" width="26" height="3" rx="1.5" fill="#BFDBFE">
        <animate attributeName="y" values="298;310;298" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="305" width="20" height="3" rx="1.5" fill="#BFDBFE">
        <animate attributeName="y" values="305;317;305" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="312" width="23" height="3" rx="1.5" fill="#BFDBFE">
        <animate attributeName="y" values="312;324;312" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="319" width="18" height="3" rx="1.5" fill="#93C5FD">
        <animate attributeName="y" values="319;331;319" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="78" y="294" width="60" height="6" rx="3" fill="#E5E7EB">
        <animate attributeName="y" values="294;306;294" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="78" y="305" width="44" height="9" rx="3" fill="#111827">
        <animate attributeName="y" values="305;317;305" dur="3.8s" repeatCount="indefinite" />
      </rect>
      <rect x="78" y="320" width="56" height="6" rx="3" fill="#3B82F6">
        <animate attributeName="y" values="320;332;320" dur="3.8s" repeatCount="indefinite" />
      </rect>

     
      <circle cx="480" cy="60" r="5" fill="#3B82F6" opacity="0.4">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="180" r="3.5" fill="#10B981" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="10" cy="80" r="4" fill="#F59E0B" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function ReceiptScanVector() {
  return (
    <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="scanLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%"  stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
     
      <rect x="80" y="10" width="120" height="200" rx="16" fill="url(#phoneGrad)" />
      <rect x="85" y="15" width="110" height="190" rx="12" fill="#1E293B" />
      
      <rect x="115" y="18" width="50" height="10" rx="5" fill="#0F172A" />
      <circle cx="140" cy="23" r="3" fill="#334155" />
      
      <rect x="90" y="35" width="100" height="155" rx="8" fill="#0F172A" />
      
      <rect x="105" y="50" width="70" height="100" rx="6" fill="white" />
      <rect x="112" y="60" width="56" height="4" rx="2" fill="#E5E7EB" />
      <rect x="112" y="68" width="40" height="4" rx="2" fill="#E5E7EB" />
      <rect x="112" y="76" width="56" height="1" rx="0.5" fill="#F3F4F6" />
      <rect x="112" y="82" width="30" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="148" y="82" width="20" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="112" y="89" width="35" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="148" y="89" width="18" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="112" y="96" width="28" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="148" y="96" width="20" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="112" y="103" width="56" height="1" rx="0.5" fill="#F3F4F6" />
      <rect x="112" y="108" width="28" height="5" rx="2" fill="#111827" />
      <rect x="140" y="108" width="28" height="5" rx="2" fill="#3B82F6" />
      
      <path d="M100 46 L100 56 L110 56" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M180 46 L180 56 L170 56" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M100 154 L100 144 L110 144" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M180 154 L180 144 L170 144" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
     
      <rect x="100" y="95" width="80" height="2" rx="1" fill="url(#scanLine)">
        <animate attributeName="y" values="52;148;52" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
      </rect>
      
      <rect x="20" y="80" width="54" height="24" rx="12" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="89" width="38" height="6" rx="3" fill="#3B82F6">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </rect>
      <rect x="207" y="90" width="60" height="24" rx="12" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="215" y="99" width="44" height="6" rx="3" fill="#10B981">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1.2s" repeatCount="indefinite" />
      </rect>
      <rect x="15" y="120" width="60" height="24" rx="12" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1.8s" repeatCount="indefinite" />
      </rect>
      <rect x="23" y="129" width="44" height="6" rx="3" fill="#F59E0B">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1.8s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function BudgetVector() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#F0F9FF" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="260" height="180" rx="16" fill="url(#bg2)" />
      <rect x="24" y="26" width="90" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="24" y="38" width="60" height="12" rx="4" fill="#1E40AF" />
     
      {[
        { label: 72, bar: 140, color: '#EF4444', w: 92 },
        { label: 55, bar: 155, color: '#F59E0B', w: 110 },
        { label: 38, bar: 170, color: '#10B981', w: 144 },
        { label: 60, bar: 185, color: '#3B82F6', w: 76  },
      ].map(({ label, bar, color, w }, i) => (
        <g key={i}>
          <rect x="24"  y={bar} width={label} height="7" rx="3.5" fill="#DBEAFE" />
          <rect x="100" y={bar} width="156"   height="7" rx="3.5" fill="#F1F5F9" />
          <rect x="100" y={bar} width={w}     height="7" rx="3.5" fill={color} opacity="0.8" />
        </g>
      ))}
      
      <rect x="170" y="20" width="90" height="36" rx="10" fill="white"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
        <animate attributeName="y" values="20;14;20" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle cx="188" cy="38" r="9" fill="#FEE2E2">
        <animate attributeName="cy" values="38;32;38" dur="3s" repeatCount="indefinite" />
      </circle>
      <rect x="201" y="32" width="50" height="5" rx="2.5" fill="#E5E7EB">
        <animate attributeName="y" values="32;26;32" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="201" y="41" width="38" height="7" rx="3" fill="#EF4444">
        <animate attributeName="y" values="41;35;41" dur="3s" repeatCount="indefinite" />
      </rect>
      
      <circle cx="224" cy="130" r="36" fill="none" stroke="#EFF6FF" strokeWidth="10" />
      <circle cx="224" cy="130" r="36" fill="none" stroke="#3B82F6" strokeWidth="10"
        strokeDasharray="226" strokeDashoffset="68"
        strokeLinecap="round" transform="rotate(-90 224 130)">
        <animate attributeName="stroke-dashoffset" values="226;68;68" dur="1.5s" fill="freeze" />
      </circle>
      <circle cx="224" cy="130" r="36" fill="none" stroke="#10B981" strokeWidth="10"
        strokeDasharray="226" strokeDashoffset="136"
        strokeLinecap="round" transform="rotate(-90 224 130)">
        <animate attributeName="stroke-dashoffset" values="226;136;136" dur="1.5s" begin="0.3s" fill="freeze" />
      </circle>
      <rect x="208" y="124" width="32" height="12" rx="4" fill="#1E40AF" />
    </svg>
  )
}

function GoalsVector() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      
      <rect x="20" y="30" width="240" height="55" rx="14" fill="#F0FDF4"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
      <rect x="20" y="95" width="240" height="55" rx="14" fill="#EFF6FF"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
      <rect x="20" y="160" width="240" height="30" rx="10" fill="#FFFBEB"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))' }} />

      
      <circle cx="50" cy="57" r="14" fill="#D1FAE5" />
      <polyline points="43,57 48,62 57,51" stroke="#10B981" strokeWidth="2.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="72" y="46" width="80" height="6" rx="3" fill="#374151" />
      <rect x="72" y="57" width="140" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="72" y="57" width="140" height="5" rx="2.5" fill="#10B981" />
      <rect x="218" y="47" width="30" height="16" rx="8" fill="#D1FAE5" />
      <rect x="223" y="52" width="20" height="6" rx="3" fill="#10B981" />

    
      <circle cx="50" cy="122" r="14" fill="#DBEAFE" />
      <circle cx="50" cy="122" r="8" fill="none" stroke="#BFDBFE" strokeWidth="2" />
      <circle cx="50" cy="122" r="8" fill="none" stroke="#3B82F6" strokeWidth="2"
        strokeDasharray="35" strokeDashoffset="12"
        transform="rotate(-90 50 122)" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="35;12;12" dur="1.5s" fill="freeze" />
      </circle>
      <rect x="72" y="111" width="68" height="6" rx="3" fill="#374151" />
      <rect x="72" y="122" width="140" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="72" y="122" width="86" height="5" rx="2.5" fill="#3B82F6">
        <animate attributeName="width" values="0;86;86" dur="1.5s" fill="freeze" />
      </rect>
      <rect x="218" y="112" width="30" height="16" rx="8" fill="#DBEAFE" />
      <rect x="223" y="117" width="20" height="6" rx="3" fill="#3B82F6" />

     
      <circle cx="50" cy="175" r="10" fill="#FEF3C7" />
      <rect x="66" y="171" width="50" height="5" rx="2.5" fill="#92400E" opacity="0.5" />
      <rect x="122" y="171" width="100" height="5" rx="2.5" fill="#F3F4F6" />
      <rect x="122" y="171" width="24" height="5" rx="2.5" fill="#F59E0B" />

    
      <circle cx="248" cy="175" r="12" fill="#3B82F6">
        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="243" y="174" width="10" height="2" rx="1" fill="white" />
      <rect x="247" y="170" width="2" height="10" rx="1" fill="white" />
    </svg>
  )
}

function HealthScoreVector() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      
      <circle cx="100" cy="100" r="70" fill="#F8FAFC" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="url(#scoreGrad)" strokeWidth="12"
        strokeDasharray="352" strokeDashoffset="88"
        strokeLinecap="round" transform="rotate(-90 100 100)">
        <animate attributeName="stroke-dashoffset" values="352;88;88" dur="2s" fill="freeze" />
      </circle>
      <rect x="76" y="88" width="48" height="18" rx="6" fill="#111827" />
      <rect x="82" y="110" width="36" height="6" rx="3" fill="#6B7280" />
      
      <circle cx="100" cy="36" r="16" fill="#DBEAFE" />
      <rect x="90" y="31" width="20" height="10" rx="4" fill="#3B82F6" />
      
      {[
        { y: 50,  w: 90,  color: '#10B981', label: 30 },
        { y: 74,  w: 72,  color: '#3B82F6', label: 24 },
        { y: 98,  w: 80,  color: '#F59E0B', label: 20 },
        { y: 122, w: 60,  color: '#6366F1', label: 16 },
      ].map(({ y, w, color, label }, i) => (
        <g key={i}>
          <rect x="186" y={y}       width="80"  height="8" rx="4" fill="#F1F5F9" />
          <rect x="186" y={y}       width={w}   height="8" rx="4" fill={color} opacity="0.8">
            <animate attributeName="width" values={`0;${w};${w}`} dur="1.5s" begin={`${i*0.2}s`} fill="freeze" />
          </rect>
          <rect x="274" y={y+1}    width={label < 20 ? 16 : 20} height="6" rx="3" fill="#374151" />
        </g>
      ))}
      <rect x="186" y="150" width="50" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="186" y="162" width="80" height="7" rx="3.5" fill="#E5E7EB" />
    </svg>
  )
}

function SmartDashboardVector() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="14" width="260" height="172" rx="16" fill="#EEF4FF" />
      <rect x="24" y="28" width="112" height="7" rx="3.5" fill="#BFDBFE" />
      <rect x="24" y="40" width="76" height="12" rx="6" fill="#1D4ED8" />

      <rect x="24" y="66" width="232" height="1" fill="#DBEAFE" />
      <rect x="24" y="98" width="232" height="1" fill="#DBEAFE" />
      <rect x="24" y="130" width="232" height="1" fill="#DBEAFE" />

      {[52, 76, 101, 127, 152, 178].map((x, i) => (
        <rect key={i} x={x} y={145 - (i % 2 ? 34 : 22)} width="14" height={i % 2 ? 34 : 22} rx="4" fill="#93C5FD" />
      ))}
      <polyline
        points="28,120 70,108 102,114 140,92 178,86 214,72 252,78"
        stroke="#10B981"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[28, 70, 102, 140, 178, 214, 252].map((x, i) => {
        const ys = [120, 108, 114, 92, 86, 72, 78]
        return <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#fff" stroke="#10B981" strokeWidth="2" />
      })}
    </svg>
  )
}

function AccountBalanceVector() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="10" y="14" width="260" height="172" rx="16" fill="#EEF2FF" />
      <rect x="24" y="28" width="90" height="7" rx="3.5" fill="#C7D2FE" />
      <rect x="24" y="40" width="110" height="12" rx="6" fill="#3730A3" />

      <rect x="24" y="66" width="232" height="94" rx="14" fill="white" stroke="#E5E7EB" />
      <rect x="38" y="80" width="74" height="6" rx="3" fill="#E5E7EB" />
      <rect x="38" y="92" width="120" height="14" rx="7" fill="#111827" />
      <rect x="38" y="114" width="92" height="6" rx="3" fill="#10B981" />

      <circle cx="214" cy="102" r="28" fill="#DBEAFE" />
      <circle cx="214" cy="102" r="19" fill="none" stroke="#3B82F6" strokeWidth="8" />
      <rect x="199" y="97" width="30" height="10" rx="5" fill="#1D4ED8" />

      <rect x="24" y="168" width="146" height="8" rx="4" fill="#D1FAE5" />
      <rect x="24" y="168" width="98" height="8" rx="4" fill="#10B981" />
    </svg>
  )
}


function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target
            const dir = el.dataset.reveal || 'up'
            if (dir === 'left')  el.classList.add('revealed-left')
            else if (dir === 'right') el.classList.add('revealed-right')
            else if (dir === 'scale') el.classList.add('revealed-scale')
            else el.classList.add('revealed')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}


const features = [
  {
    // icon: MdDocumentScanner,
    title: 'AI Receipt Scanner',
    desc: 'Snap a photo — Gemini AI extracts merchant, amount, date and category instantly. No manual entry.',
    // color: 'bg-blue-100 text-blue-600',
    vector: ReceiptScanVector,
  },
  {
    // icon: MdTrendingUp,
    title: 'Smart Dashboard',
    desc: 'Beautiful charts show exactly where your money goes. Track 6 months of income vs expenses.',
    // color: 'bg-green-100 text-green-600',
    vector: SmartDashboardVector,
  },
  {
    // icon: MdTrackChanges,
    title: 'Budget Management',
    desc: 'Set monthly limits per category. Get email alerts at 80% and 100% before overspending.',
    // color: 'bg-yellow-100 text-yellow-600',
    vector: BudgetVector,
  },
  {
    // icon: MdStar,
    title: 'Savings Goals',
    desc: 'Define what you\'re saving for. Track progress visually and celebrate each milestone.',
    // color: 'bg-purple-100 text-purple-600',
    vector: GoalsVector,
  },
  {
    // icon: MdFavorite,
    title: 'Financial Health Score',
    desc: 'Get a 0–100 score based on savings rate, budget discipline, goal progress and net worth.',
    // color: 'bg-red-100 text-red-600',
    vector: HealthScoreVector,
  },
  {
    // icon: MdAccountBalance,
    title: 'Multi-Account',
    desc: 'Manage savings, checking, credit cards and investments in one place with real-time balances.',
    // color: 'bg-indigo-100 text-indigo-600',
    vector: AccountBalanceVector,
  },
]

const comparisons = [
  { feature: 'AI Receipt Scanning',    us: true,  others: false },
  { feature: 'Financial Health Score', us: true,  others: false },
  { feature: 'Budget Email Alerts',    us: true,  others: false },
  { feature: 'Monthly Email Reports',  us: true,  others: false },
  { feature: 'Multi-Account Tracking', us: true,  others: true  },
  { feature: 'Goal Tracking',          us: true,  others: true  },
  { feature: 'CSV Import & Export',    us: true,  others: true  },
  { feature: 'Free to Use',            us: true,  others: false },
]

const testimonials = [
  {
    name: 'Priya Sharma', role: 'Software Engineer, Bangalore', avatar: 'PS',
    text: 'FinanceVU changed how I manage money. The AI receipt scanner saves me 30 minutes a week. The health score keeps me motivated to save more.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta', role: 'MBA Student, Mumbai', avatar: 'RM',
    text: 'The budget alerts stopped me from overspending three times last month. Finally a finance app that actually explains where my money goes.',
    rating: 5,
  },
  {
    name: 'Ananya Krishnan', role: 'Freelance Designer, Chennai', avatar: 'AK',
    text: "As a freelancer with variable income, FinanceVU's multi-account tracking and monthly reports are invaluable.",
    rating: 5,
  },
]

const stats = [
  { value: '50K+', label: 'Transactions Tracked' },
  { value: '10K+', label: 'Active Users' },
  { value: '₹2Cr+', label: 'Money Managed' },
  { value: '4.9★', label: 'User Rating' },
]


const processSteps = [
  {
    step: '01',
    title: 'Create an account',
    desc: 'Sign up and set your monthly baseline in less than a minute.',
    meta: 'Setup',
  },
  {
    step: '02',
    title: 'Add your transactions',
    desc: 'Import CSV or add entries manually to start tracking instantly.',
    meta: 'Data',
  },
  {
    step: '03',
    title: 'Review insights',
    desc: 'Use dashboard trends and budget alerts to improve monthly decisions.',
    meta: 'Insights',
  },
]



export default function LandingPage() {
  useScrollReveal()

  const [activeSection, setActiveSection] = useState('features')

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'compare', label: 'Compare' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ]

   const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const navOffset = 88
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    setActiveSection(id)
  }

   useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-20% 0px -55% 0px',
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">


<nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <Link to="/" className="flex items-center">
      <img
        src={logo}
        alt="FinanceVUE"
        className="h-9 w-auto object-contain"
      />
    </Link>

    <div className="hidden md:flex items-center gap-3 text-sm font-medium">
      {navItems.map(({ id, label }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className={`px-3 py-1.5 rounded-md border-b-2 transition-all duration-300
              ${isActive
                ? 'bg-blue-50 text-blue-700 border-black'
                : 'bg-transparent text-gray-500 border-transparent hover:text-blue-600 hover:bg-blue-50/70'
              }`}
          >
            {label}
          </button>
        )
      })}
    </div>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      
      <section className="pt-28 pb-0 px-6 bg-gradient-to-b from-blue-50/80 via-white to-white relative overflow-hidden">

       
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #93C5FD 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />

        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

           
            <div>
              {/* <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 animate-fade-in">
                <MdSpeed className="text-sm" />
                AI-Powered Personal Finance
              </div> */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 animate-fade-up">
                Master Your<br />
                <span className="gradient-text">Money</span> with AI
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 animate-fade-up delay-200">
                Track expenses, scan receipts with AI, set smart budgets
                and achieve savings goals — all in one clean interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-300">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-200">
                  Start for Free
                  <MdArrowForward className="text-base" />
                </Link>
                <a href="#features"
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-7 py-3.5 rounded-2xl text-sm transition-colors">
                  See Features
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4 animate-fade-up delay-400">
                No credit card required · Free forever
              </p>

              
              <div className="flex items-center gap-6 mt-8 animate-fade-up delay-500">
                {stats.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-bold text-blue-600">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="relative h-[420px] animate-fade-in delay-300">
              <HeroDashboardVector />
            </div>
          </div>
        </div>

        
        <div className="mt-16">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30 C240 60 480 0 720 30 C960 60 1200 0 1440 30 L1440 60 L0 60 Z"
              fill="white" />
          </svg>
        </div>
      </section>

      
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16 reveal">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for how you actually<br />
              <span className="gradient-text">think about money</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every feature is designed to reduce friction and give you clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({  title, desc, vector: Vec }, i) => (
              <div key={title}
                data-reveal="up"
                className={`reveal group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default`}
                style={{ animationDelay: `${i * 0.1}s` }}>

              
                {/* <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="text-2xl" />
                </div> */}

                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>

                
                {Vec && (
                  <div className="mt-4 h-28 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Vec />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14 reveal">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Simple process
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Up and running in <span className="gradient-text">3 minutes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {processSteps.map(({ step, title, desc, meta }, i) => (
    <article
      key={step}
      data-reveal="up"
      className="reveal relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${i * 0.12}s` }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
          {step}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {meta}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm leading-6 text-gray-600">{desc}</p>

      <div className="mt-6 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${(i + 1) * 33.33}%` }}
        />
      </div>
    </article>
  ))}
</div>

          
          <div className="hidden md:block mt-6">
  <div className="grid grid-cols-3 gap-6 px-6">
    <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    <div />
  </div>
  </div>
</div>
      </section>

      
      <section id="compare" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Comparison
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why <span className="gradient-text">FinanceVUE</span> stands out
            </h2>
            <p className="text-gray-500 text-lg">
              We built what other apps were missing.
            </p>
          </div>

          <div className="reveal rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-6 py-4 text-sm font-semibold text-gray-500">Feature</div>
              <div className="px-6 py-4 text-sm font-bold text-blue-600 text-center bg-blue-50 border-x border-gray-200">
                FinanceVUE ✦
              </div>
              <div className="px-6 py-4 text-sm font-semibold text-gray-400 text-center">Others</div>
            </div>
            {comparisons.map(({ feature, us, others }, i) => (
              <div key={feature}
                className={`grid grid-cols-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <div className="px-6 py-4 text-sm text-gray-700 font-medium">{feature}</div>
                <div className="px-6 py-4 flex justify-center bg-blue-50/40 border-x border-gray-100">
                  {us
                    ? <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <MdCheck className="text-green-600 text-sm" />
                      </div>
                    : <span className="text-gray-300 text-lg">–</span>
                  }
                </div>
                <div className="px-6 py-4 flex justify-center">
                  {others
                    ? <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <MdCheck className="text-green-600 text-sm" />
                      </div>
                    : <span className="text-gray-300 text-lg">–</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section id="testimonials" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Real users
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by thousands of <span className="gradient-text">Indians</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }, i) => (
              <div key={name} data-reveal="up"
                className="reveal bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, j) => (
                    <MdStar key={j} className="text-yellow-400 text-lg" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="about" className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-14 reveal">
            <h2 className="text-4xl font-bold text-white mb-4">About FinanceVUE</h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
              Built by developers who were frustrated with complicated, expensive finance apps.
              We believe everyone deserves simple, powerful tools to understand their money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: MdSecurity,   title: 'Bank-Level Security',  desc: 'Your data is encrypted end-to-end and never sold or shared.' },
              { icon: MdSmartphone, title: 'Works Everywhere',     desc: 'Any device, any screen size — desktop, tablet or mobile browser.' },
              { icon: MdSpeed,      title: 'Lightning Fast',       desc: 'Built on Spring Boot + React for instant responses every time.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} data-reveal="scale"
                className="reveal glass rounded-2xl p-6 text-center hover:bg-white/15 transition-colors"
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-blue-100 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      
      <section id="contact" className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Get in touch
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contact <span className="gradient-text">Us</span>
            </h2>
            <p className="text-gray-500 text-lg">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: MdEmail,      title: 'Email',    value: 'support@FinanceVUE.in', color: 'bg-blue-100 text-blue-600' },
              { icon: MdPhone,      title: 'Phone',    value: '+91 98765 43210',         color: 'bg-green-100 text-green-600' },
              { icon: MdLocationOn, title: 'Location', value: 'Chandigarh, India',       color: 'bg-purple-100 text-purple-600' },
            ].map(({ icon: Icon, title, value, color }, i) => (
              <div key={title} data-reveal="up"
                className="reveal bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="text-2xl" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-gray-500 text-sm">{value}</p>
              </div>
            ))}
          </div>

          <div className="reveal bg-white rounded-2xl border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-all" />
              <input type="email" placeholder="Your Email"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-all" />
            </div>
            <input type="text" placeholder="Subject"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-all mb-4" />
            <textarea rows={4} placeholder="Your message..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-all mb-4 resize-none" />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2">
              <MdEmail className="text-base" />
              Send Message
            </button>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MdAccountBalance className="text-white text-lg" />
                </div>
                <span className="font-bold text-lg">FinanceVU</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                AI-powered personal finance for modern India.
              </p>
              <div className="flex gap-2">
                {[FaTwitter, FaGithub, FaLinkedin].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-4 text-gray-100">Product</p>
              <div className="space-y-2.5 text-sm text-gray-400">
                {['Features','Compare','Reviews','Get Started'].map(item => (
                  <a key={item} href="#" className="block hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-4 text-gray-100">Company</p>
              <div className="space-y-2.5 text-sm text-gray-400">
                {['About Us','Contact','Privacy Policy','Terms of Service'].map(item => (
                  <a key={item} href="#" className="block hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-4 text-gray-100">Stay Updated</p>
              <p className="text-gray-400 text-sm mb-3">Get financial tips and updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 FinanceVU. All rights reserved.</p>
            <p className="text-gray-500 text-sm">Made with Love in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}