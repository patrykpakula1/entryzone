export type Team = {
  id: string
  name: string
  players: [string, string, string, string, string]
  substitute?: string
}

export type Slot = string | null

export type MatchResult = {
  scoreA: number
  scoreB: number
  winner: 'A' | 'B'
}

export type Match = {
  id: string
  teamA: Slot
  teamB: Slot
  result?: MatchResult
}

export const teams: Record<string, Team> = {
  'iron-wolves': {
    id: 'iron-wolves',
    name: 'Iron Wolves',
    players: ['Sh4rk', 'Nomad', 'Ferox', 'Kailen', 'Drizzt'],
    substitute: 'Voss',
  },
  'nocna-straz': {
    id: 'nocna-straz',
    name: 'Nocna Straż',
    players: ['Cinder', 'Wrath', 'Solmyr', 'Yuki', 'Bastion'],
    substitute: 'Ondra',
  },
  'veles-gaming': {
    id: 'veles-gaming',
    name: 'Veles Gaming',
    players: ['Piorun', 'Skalny', 'Ondyna', 'Grom', 'Wicher'],
  },
  'czerwona-flaga': {
    id: 'czerwona-flaga',
    name: 'Czerwona Flaga',
    players: ['Kroos', 'Ashen', 'Talon', 'Mira', 'Devlin'],
    substitute: 'Ruda',
  },
  kuznia: {
    id: 'kuznia',
    name: 'Kuźnia',
    players: ['Hardy', 'Ember', 'Vulcan', 'Rook', 'Sable'],
  },
  'sowa-squad': {
    id: 'sowa-squad',
    name: 'Sowa Squad',
    players: ['Nyx', 'Peregrine', 'Talia', 'Orin', 'Vesper'],
    substitute: 'Lumen',
  },
  brzask: {
    id: 'brzask',
    name: 'Brzask',
    players: ['Aurex', 'Dawn', 'Solenne', 'Kestrel', 'Marrow'],
  },
}

export const ROUND_LABELS = ['Runda 1', 'Ćwierćfinał', 'Półfinał', 'Finał']

/**
 * Przykładowe dane: 7 zapisanych drużyn, reszta slotów pusta ("wolne
 * miejsce"). Rundy 2+ startują bez uczestników — wypełnią się zwycięzcami,
 * gdy turniej ruszy.
 */
export const bracket: Match[][] = [
  [
    { id: 'r1-m1', teamA: 'iron-wolves', teamB: null },
    {
      id: 'r1-m2',
      teamA: 'nocna-straz',
      teamB: 'veles-gaming',
      result: { scoreA: 13, scoreB: 7, winner: 'A' },
    },
    { id: 'r1-m3', teamA: null, teamB: null },
    { id: 'r1-m4', teamA: 'czerwona-flaga', teamB: null },
    {
      id: 'r1-m5',
      teamA: 'kuznia',
      teamB: 'sowa-squad',
      result: { scoreA: 9, scoreB: 13, winner: 'B' },
    },
    { id: 'r1-m6', teamA: 'brzask', teamB: null },
    { id: 'r1-m7', teamA: null, teamB: null },
    { id: 'r1-m8', teamA: null, teamB: null },
  ],
  [
    { id: 'r2-m1', teamA: null, teamB: null },
    { id: 'r2-m2', teamA: null, teamB: null },
    { id: 'r2-m3', teamA: null, teamB: null },
    { id: 'r2-m4', teamA: null, teamB: null },
  ],
  [
    { id: 'r3-m1', teamA: null, teamB: null },
    { id: 'r3-m2', teamA: null, teamB: null },
  ],
  [{ id: 'r4-m1', teamA: null, teamB: null }],
]
