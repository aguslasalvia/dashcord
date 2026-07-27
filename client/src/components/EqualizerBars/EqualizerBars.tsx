import "./EqualizerBars.css";

interface BarConfig {
	minHeight: number;
	maxHeight: number;
	duration: number;
	delay: number;
}

interface Preset {
	barWidth: number;
	gap: number;
	bars: BarConfig[];
}

// Same signature motion as mobile's EqualizerBars (mobile/src/components/EqualizerBars.tsx),
// ported bar-for-bar so the animation reads as one shared identity across apps.
const PRESETS: Record<"hero" | "md" | "sm", Preset> = {
	hero: {
		barWidth: 6,
		gap: 7,
		bars: [
			{ minHeight: 14, maxHeight: 40, duration: 620, delay: 0 },
			{ minHeight: 22, maxHeight: 74, duration: 740, delay: 90 },
			{ minHeight: 18, maxHeight: 58, duration: 560, delay: 180 },
			{ minHeight: 26, maxHeight: 96, duration: 820, delay: 40 },
			{ minHeight: 16, maxHeight: 66, duration: 680, delay: 220 },
			{ minHeight: 24, maxHeight: 52, duration: 600, delay: 130 },
			{ minHeight: 14, maxHeight: 44, duration: 700, delay: 60 },
		],
	},
	md: {
		barWidth: 4,
		gap: 5,
		bars: [
			{ minHeight: 6, maxHeight: 16, duration: 480, delay: 0 },
			{ minHeight: 8, maxHeight: 26, duration: 560, delay: 110 },
			{ minHeight: 6, maxHeight: 20, duration: 420, delay: 210 },
			{ minHeight: 8, maxHeight: 24, duration: 520, delay: 60 },
		],
	},
	sm: {
		barWidth: 3,
		gap: 3,
		bars: [
			{ minHeight: 3, maxHeight: 8, duration: 380, delay: 0 },
			{ minHeight: 4, maxHeight: 13, duration: 440, delay: 90 },
			{ minHeight: 3, maxHeight: 10, duration: 400, delay: 170 },
		],
	},
};

interface EqualizerBarsProps {
	size?: "hero" | "md" | "sm";
	color?: string;
	className?: string;
}

// The app's one recurring signature motion — a little audio equalizer.
// Used at brand scale on auth screens, and reused anywhere something needs
// to signal "loading" or "playing right now" instead of a generic spinner.
export default function EqualizerBars({ size = "md", color = "var(--accent)", className }: EqualizerBarsProps) {
	const preset = PRESETS[size];
	const maxBarHeight = Math.max(...preset.bars.map((bar) => bar.maxHeight));

	return (
		<div
			className={`equalizer-bars${className ? ` ${className}` : ""}`}
			style={{ gap: preset.gap, height: maxBarHeight }}
			aria-hidden="true"
		>
			{preset.bars.map((bar, i) => (
				<span
					key={i}
					className="equalizer-bar"
					style={
						{
							width: preset.barWidth,
							borderRadius: preset.barWidth / 2,
							background: color,
							animationDuration: `${bar.duration}ms`,
							animationDelay: `${bar.delay}ms`,
							"--eq-min": `${bar.minHeight}px`,
							"--eq-max": `${bar.maxHeight}px`,
						} as React.CSSProperties
					}
				/>
			))}
		</div>
	);
}
