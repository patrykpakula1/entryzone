import { useCountdown } from '../../hooks/useCountdown'

type CountdownProps = { target: Date }

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown({ target }: CountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(target)

  const units = [
    { value: days, label: 'Dni' },
    { value: hours, label: 'Godzin' },
    { value: minutes, label: 'Minut' },
    { value: seconds, label: 'Sekund' },
  ]

  return (
    <div className="flex items-start gap-6 sm:gap-10">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center gap-1">
          <span className="font-display text-4xl tabular-nums text-gold sm:text-5xl">
            {pad(unit.value)}
          </span>
          <span className="text-[0.625rem] uppercase tracking-[0.25em] text-copper sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
