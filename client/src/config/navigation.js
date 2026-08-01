import {
    LayoutDashboard,
    Package,
    FileText,
    CalendarDays,
    ShieldCheck,
    Users,
    Bot,
    BarChart3,
    Bell,
    Settings,
} from "lucide-react";

export const navigation = [
    {
        title: "MAIN",
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/dashboard",
            },
            {
                label: "Assets",
                icon: Package,
                href: "/assets",
            },
            {
                label: "Documents",
                icon: FileText,
                href: "/documents",
            },
            {
                label: "Calendar",
                icon: CalendarDays,
                href: "/calendar",
            },
            {
                label: "Warranty",
                icon: ShieldCheck,
                href: "/warranty",
            },
        ],
    },

    {
        title: "SMART",
        items: [
            {
                label: "AI Assistant",
                icon: Bot,
                href: "/ai",
            },
            {
                label: "Analytics",
                icon: BarChart3,
                href: "/analytics",
            },
            {
                label: "Notifications",
                icon: Bell,
                href: "/notifications",
            },
        ],
    },

    {
        title: "ACCOUNT",
        items: [
            {
                label: "Settings",
                icon: Settings,
                href: "/settings",
            },
        ],
    },
];