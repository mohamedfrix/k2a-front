'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
    addDays,
  isWeekend,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getVehicleCalendar } from '@/lib/api/publicContracts';

interface CalendarProps {
  vehicleId?: string;
  calendarData?: Array<{
    date: string;
    available: boolean;
    contractId?: string;
    startDate?: string;
    endDate?: string;
  }>;
  onCalendarDataChange?: (data: any[]) => void;
}

export default function CustomCalendar({ 
  vehicleId, 
  calendarData = [], 
  onCalendarDataChange 
}: CalendarProps) {

    const { t } = useLanguage();

    let weekDays : string[] = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(t(`weekDaysAbbr.${i}`));
    }

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch calendar data when month changes
    useEffect(() => {
        const fetchCalendarData = async () => {
            if (!vehicleId || !onCalendarDataChange) return;
            
            try {
                setLoading(true);
                const data = await getVehicleCalendar(
                    vehicleId,
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                );
                onCalendarDataChange(data);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, [vehicleId, currentDate, onCalendarDataChange]);

    // Get the calendar data
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Get complete calendar view (6 weeks)
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Group days into weeks for easier rendering
    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
    }

    // Build a set of contract-covered dates (inclusive of end date)
    // This ensures the calendar shows the last day of a contract as unavailable
    const coveredDates = new Set<string>();

    // Group by contractId when available
    const contractsById: Record<string, string[]> = {};
    for (const item of calendarData) {
        if (item.contractId) {
            if (!contractsById[item.contractId]) contractsById[item.contractId] = [];
            contractsById[item.contractId].push(item.date);
        }
    }

    // For each contract group, determine the min/max date and fill the inclusive range
    Object.values(contractsById).forEach((dates) => {
        if (!dates || dates.length === 0) return;
        const sorted = dates.slice().sort();
        const start = parseISO(sorted[0]);
        const end = parseISO(sorted[sorted.length - 1]);
        let cur = start;
        while (cur <= end) {
            coveredDates.add(format(cur, 'yyyy-MM-dd'));
            cur = addDays(cur, 1);
        }
    });

    // Also cover any explicit startDate/endDate pairs present on items (fallback)
    for (const item of calendarData) {
        if (item.startDate && item.endDate) {
            const start = parseISO(item.startDate);
            const end = parseISO(item.endDate);
            let cur = start;
            while (cur <= end) {
                coveredDates.add(format(cur, 'yyyy-MM-dd'));
                cur = addDays(cur, 1);
            }
        }
    }

    // Navigation functions
    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Helper function to check if a date is available
    const isDateAvailable = (date: Date): boolean => {
        const dateString = format(date, 'yyyy-MM-dd');
        // If this date is covered by a known contract range (inclusive), treat as unavailable
        if (coveredDates.has(dateString)) return false;

        const calendarItem = calendarData.find(item => item.date === dateString);
        return calendarItem ? calendarItem.available : true; // Default to available if no data
    };

    // Helper function to get date status
    const getDateStatus = (date: Date): 'available' | 'unavailable' | 'unknown' => {
        const dateString = format(date, 'yyyy-MM-dd');
        if (coveredDates.has(dateString)) return 'unavailable';
        const calendarItem = calendarData.find(item => item.date === dateString);
        if (!calendarItem) return 'unknown';
        return calendarItem.available ? 'available' : 'unavailable';
    };

    // Animation variants
    const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } }
    };

    const dayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
    };

    const weekVariants = {
    hidden: { opacity: 0 },
    visible: (weekIndex: number) => ({
        opacity: 1,
        transition: {
        delay: weekIndex * 0.1,
        duration: 0.5,
        staggerChildren: 0.05
        }
    })
    };

    return (
    <motion.div 
        className="w-full max-w-md mx-auto bg-surface rounded-xl shadow-lg overflow-hidden border border-outline-variant"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        {/* Header with navigation */}
    <motion.div 
    className="p-4 bg-primary"
        variants={headerVariants}
        >
        <div className="flex items-center justify-between mb-4">
            <motion.button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            >
            <ChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <motion.h2 
            className="text-xl font-semibold text-white text-center flex-1"
            key={format(currentDate, 'MMMM yyyy')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            >
            {format(currentDate, 'MMMM yyyy')}
            </motion.h2>
            
            <motion.button 
            onClick={goToNextMonth}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            >
            <ChevronRight className="w-4 h-4" />
            </motion.button>
        </div>
        
        <motion.button 
            onClick={goToToday}
            className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-white flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <CalendarIcon className="w-4 h-4" />
            Today
        </motion.button>
        </motion.div>
        
        <div className="p-4">
        {/* Weekday headers */}
        <motion.div 
            className="grid grid-cols-7 gap-1 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            {weekDays.map((day, index) => (
            <motion.div 
                key={day} 
                className="text-center text-xs font-medium text-on-surface-variant py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
            >
                {day}
            </motion.div>
            ))}
        </motion.div>
        
        {/* Calendar grid by weeks */}
        <div className="space-y-1">
            <AnimatePresence mode="wait">
            {weeks.map((week, weekIndex) => (
                <motion.div 
                key={`${weekIndex}-${format(currentDate, 'yyyy-MM')}`}
                className="grid grid-cols-7 gap-6"
                variants={weekVariants}
                initial="hidden"
                animate="visible"
                custom={weekIndex}
                >
                {week.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const isWeekendDay = isWeekend(day);
                    const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const dateStatus = getDateStatus(day);
                    const isAvailable = isDateAvailable(day);
                    
                    return (
                    <motion.button
                        key={day.toString()}
                        variants={dayVariants}
                        whileHover="hover"
                        whileTap="tap"
                        disabled={!isAvailable || !isCurrentMonth}
                        className={`
                        relative h-10 w-full rounded-lg text-sm font-medium transition-all duration-200
                        ${isDayToday 
                            ? 'bg-primary text-on-primary shadow-md' 
                            : isSelected
                            ? 'bg-secondary-container text-on-secondary-container ring-2 ring-secondary'
                            : !isAvailable && isCurrentMonth
                            ? 'bg-error/20 text-error cursor-not-allowed'
                            : isCurrentMonth 
                            ? 'bg-surface-variant text-on-surface hover:bg-primary-container hover:text-on-primary-container' 
                            : 'text-on-surface-variant hover:bg-surface-variant'
                        }
                        
                        ${!isAvailable && isCurrentMonth ? 'opacity-60' : ''}
                        `}
                        onClick={() => {
                            if (isAvailable && isCurrentMonth) {
                                setSelectedDate(day);
                                console.log('Selected:', format(day, 'yyyy-MM-dd'));
                            }
                        }}
                    >
                        {format(day, 'd')}
                        {isDayToday && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        />
                        )}
                        {!isAvailable && isCurrentMonth && (
                            <motion.div
                                className="absolute inset-0 rounded-lg border border-error/30"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            />
                        )}
                    </motion.button>
                    );
                })}
                </motion.div>
            ))}
            </AnimatePresence>
        </div>

        </div>
        
        {/* Calendar Legend */}
        <motion.div 
        className="bg-surface-variant p-4 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        >
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-variant border border-outline-variant rounded"></div>
                <span className="text-on-surface-variant text-xs">Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-error/20 border border-error/30 rounded"></div>
                <span className="text-error text-xs">Unavailable</span>
            </div>
        </div>
        {selectedDate && (
            <motion.div 
            className="space-y-1 pt-2 border-t border-outline-variant"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            >
            <p className="text-on-surface-variant text-xs font-medium">SELECTED DATE</p>
            <p className="text-secondary font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            </motion.div>
        )}
        </motion.div>

    </motion.div>
    );
}