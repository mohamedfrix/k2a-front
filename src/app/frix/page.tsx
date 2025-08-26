import Calendar from "@/components/car_page/Calendar";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function FrixPage() {
    return (
        <>
            <div className="fixed top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            <Calendar />
        </>
    );
}