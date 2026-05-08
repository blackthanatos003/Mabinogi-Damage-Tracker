import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const settings = {
    margin: { right: 5 },
    width: 350,
    height: 350,
    hideLegend: false,
};

const customColors = [
    "#8684BF", "#81B7C7", "#7ECFA1", "#9CD67A", "#DECC76",
    "#E67470", "#ED6BCD", "#A564F5", "#5D95FC", "#54FFE5",
    "#4AFF53", "#CFFF40", "#FF9036", "#FF2B72", "#E121FF",
    "#6C8EBF", "#9673A6", "#D79B00", "#B85450", "#82B366",
];

function formatLargeNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    const absNum = Math.abs(num);
    if (absNum >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (absNum >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (absNum >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (absNum >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(0);
}

function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <text x={left + width / 2} y={top + height / 2}
            textAnchor="middle" dominantBaseline="central"
            style={{ fill: 'currentColor', fontSize: 16 }}>
            {children}
        </text>
    );
}

export default function SkillDamagePieChart({ chartData, players, selectedPlayer, onPlayerChange }) {
    if (!chartData || chartData.length === 0) {
        return (
            <Paper sx={{ padding: "16px", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4">Skill Damage</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>No data available</Typography>
            </Paper>
        );
    }

    const totalDamage = chartData.reduce((sum, item) => sum + item.value, 0);

    const merged = [];
    let otherValue = 0;
    chartData.forEach(item => {
        const pct = totalDamage > 0 ? (item.value / totalDamage) * 100 : 0;
        if (pct < 2 && chartData.length > 10) {
            otherValue += item.value;
        } else {
            merged.push(item);
        }
    });
    if (otherValue > 0) {
        merged.push({ label: 'Other', value: otherValue, color: customColors[customColors.length - 1] });
    }

    return (
        <Paper sx={{ padding: "16px", height: "100%", display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4">Skill Damage</Typography>
                {players && players.length > 0 && (
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Player</InputLabel>
                        <Select
                            value={selectedPlayer ?? -1}
                            label="Player"
                            onChange={(e) => onPlayerChange?.(e.target.value)}
                        >
                            <MenuItem value={-1}>All Players</MenuItem>
                            {players.map((p) => (
                                <MenuItem key={p.id} value={p.id}>{p.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                <PieChart
                    series={[{
                        data: merged,
                        innerRadius: 65,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 45, additionalRadius: -30, color: 'gray' },
                    }]}
                    colors={customColors}
                    {...settings}
                >
                    <PieCenterLabel>{formatLargeNumber(totalDamage)}</PieCenterLabel>
                </PieChart>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 2, overflowY: 'auto', maxHeight: 350, flex: 1 }}>
                    {chartData.map((item, idx) => {
                        const pct = totalDamage > 0 ? ((item.value / totalDamage) * 100).toFixed(1) : '0.0';
                        return (
                            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircleIcon sx={{ color: item.color ?? customColors[idx % customColors.length], fontSize: 12 }} />
                                <Typography variant="caption" sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {pct}%
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Paper>
    );
}
