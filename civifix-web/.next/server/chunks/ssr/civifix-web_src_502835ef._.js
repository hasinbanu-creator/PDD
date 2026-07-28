module.exports = [
"[project]/civifix-web/src/hooks/use-complaints.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssignedComplaints",
    ()=>useAssignedComplaints,
    "useComplaint",
    ()=>useComplaint,
    "useComplaints",
    ()=>useComplaints,
    "useCreateComplaint",
    ()=>useCreateComplaint,
    "useWardComplaints",
    ()=>useWardComplaints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/auth.ts [app-ssr] (ecmascript)");
;
;
function useComplaints(params = {}, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "complaints",
            params
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getComplaints(params),
        ...options
    });
}
function useComplaint(id, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "complaint",
            id
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getComplaint(id),
        enabled: !!id,
        ...options
    });
}
function useCreateComplaint() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (complaintData)=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createComplaint(complaintData),
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    "complaints"
                ]
            });
        }
    });
}
function useWardComplaints(params = {}, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "ward-complaints",
            params
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getWardComplaints(params),
        ...options
    });
}
function useAssignedComplaints(params = {}, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "assigned-complaints",
            params
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getAssignedComplaints(params),
        ...options
    });
}
}),
"[project]/civifix-web/src/hooks/use-dashboard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAdminDashboard",
    ()=>useAdminDashboard,
    "useAdminStats",
    ()=>useAdminStats,
    "useInspectorDashboard",
    ()=>useInspectorDashboard,
    "useWorkerDashboard",
    ()=>useWorkerDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/auth.ts [app-ssr] (ecmascript)");
;
;
function useInspectorDashboard() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "inspector-dashboard"
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getInspectorDashboard()
    });
}
function useAdminDashboard() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "admin-dashboard"
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getDistrictAdminDashboard()
    });
}
function useAdminStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "admin-stats"
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getAdminStats()
    });
}
function useWorkerDashboard() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "worker-dashboard"
        ],
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getWorkerDashboard()
    });
}
}),
"[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/context/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-ssr] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/clipboard-list.mjs [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-ssr] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/users.mjs [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map.mjs [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/building-2.mjs [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/user.mjs [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/hooks/use-complaints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/hooks/use-dashboard.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
// Mock Data / Styles - Updated with premium tokens
const STATUS_STYLES = {
    OPEN: {
        label: "Pending",
        color: "text-accent",
        bg: "bg-accent/10"
    },
    PENDING: {
        label: "Pending",
        color: "text-accent",
        bg: "bg-accent/10"
    },
    WORKING: {
        label: "In Progress",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    IN_PROGRESS: {
        label: "In Progress",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    APPROVAL: {
        label: "Review",
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    CLOSED: {
        label: "Resolved",
        color: "text-success",
        bg: "bg-success/10"
    },
    RESOLVED: {
        label: "Resolved",
        color: "text-success",
        bg: "bg-success/10"
    },
    REJECTED: {
        label: "Rejected",
        color: "text-destructive",
        bg: "bg-destructive/10"
    }
};
const TYPE_META = {
    ROAD_DAMAGE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Road Damage"
    },
    POTHOLE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Pothole"
    },
    GARBAGE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        color: "text-secondary",
        bg: "bg-secondary/10",
        title: "Waste Collection"
    },
    STREETLIGHT: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        color: "text-primary",
        bg: "bg-primary/10",
        title: "Street Light"
    },
    WATER_SUPPLY: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        color: "text-primary",
        bg: "bg-primary/10",
        title: "Water Supply"
    },
    DRAINAGE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        color: "text-secondary",
        bg: "bg-secondary/10",
        title: "Drainage"
    },
    SANITATION: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        color: "text-secondary",
        bg: "bg-secondary/10",
        title: "Sanitation"
    },
    TREE_CUTTING: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
        color: "text-success",
        bg: "bg-success/10",
        title: "Tree Issue"
    },
    CONSTRUCTION: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        color: "text-accent",
        bg: "bg-accent/10",
        title: "Construction"
    },
    OTHER: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Civic Issue"
    }
};
const ROLE_META = {
    SUPER_ADMIN: {
        label: "Super Admin",
        color: "text-primary",
        bg: "bg-primary/20",
        gradient: "from-primary to-slate-900"
    },
    DISTRICT_ADMIN: {
        label: "District Admin",
        color: "text-secondary",
        bg: "bg-secondary/20",
        gradient: "from-secondary to-indigo-900"
    },
    INSPECTOR: {
        label: "Inspector",
        color: "text-teal-100",
        bg: "bg-teal-800/40",
        gradient: "from-teal-800 to-teal-600"
    },
    WORKER: {
        label: "Worker",
        color: "text-success",
        bg: "bg-success/20",
        gradient: "from-success to-slate-900"
    },
    CITIZEN: {
        label: "Citizen",
        color: "text-accent",
        bg: "bg-accent/20",
        gradient: "from-primary to-slate-900"
    }
};
const ROLE_GREETING = {
    SUPER_ADMIN: {
        title: "Civifix",
        sub: "Super Admin Panel"
    },
    DISTRICT_ADMIN: {
        title: "Civifix",
        sub: "District Admin Panel"
    },
    INSPECTOR: {
        title: "Civifix",
        sub: "Inspector Dashboard"
    },
    WORKER: {
        title: "Civifix",
        sub: "Worker Dashboard"
    },
    CITIZEN: {
        title: "Civifix",
        sub: "Citizen Platform"
    }
};
// --- Shared Components ---
function SectionTitle({ left, right, rightHref }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between items-center mt-8 mb-5 px-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-base font-bold text-foreground",
                children: left
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            right && rightHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: rightHref,
                className: "text-sm font-semibold text-primary hover:text-primary/80 transition-colors",
                children: right
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
function MetricCard({ icon: Icon, value, label, colorClass, bgClass }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 bg-card rounded-2xl p-5 flex flex-col items-center justify-center border border-border shadow-sm hover:shadow-md transition-all duration-300 min-h-[110px] hover:-translate-y-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center mb-3`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: `w-6 h-6 ${colorClass}`
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-2xl font-black text-foreground",
                children: value
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-semibold text-muted-foreground text-center mt-1 uppercase tracking-wider",
                children: label
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
function ComplaintItem({ complaint, index, total }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isInspector = user?.role === "INSPECTOR" || user?.role === "WORKER";
    const type = complaint.complaint_type || "OTHER";
    const meta = TYPE_META[type] || TYPE_META.OTHER;
    const status = STATUS_STYLES[complaint.status] || STATUS_STYLES.OPEN;
    const title = complaint.title || complaint.type || meta.title;
    const desc = complaint.description || "No description provided";
    const Icon = meta.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: `/complaints/${complaint.id || complaint._id || complaint.complaint_id}`,
        className: `flex items-start p-5 hover:bg-muted/50 transition-colors duration-200 ${index !== total - 1 ? 'border-b border-border/50' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center mr-4 shrink-0 mt-1 shadow-sm`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: `w-6 h-6 ${meta.color}`
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0 mr-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-base font-bold text-foreground truncate",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    isInspector ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 space-y-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-muted-foreground truncate",
                                title: complaint.address,
                                children: [
                                    "Location: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-foreground",
                                        children: [
                                            complaint.address || desc,
                                            complaint.landmark ? ` (Landmark: ${complaint.landmark})` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            complaint.ward?.ward_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-muted-foreground",
                                children: [
                                    "Ward: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-foreground",
                                        children: complaint.ward.ward_name
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 80
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-muted-foreground tracking-wider",
                                        children: complaint.complaint_id || complaint._id || "#CIV-NEW"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1 h-1 rounded-full bg-border"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-foreground",
                                        children: [
                                            "Citizen: ",
                                            complaint.citizen?.name || "Citizen"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-1 h-1 rounded-full bg-border"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-foreground",
                                        children: [
                                            "Category: ",
                                            meta.title
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            complaint.created_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-muted-foreground mt-1",
                                children: new Date(complaint.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 146,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-muted-foreground truncate mt-1",
                                children: desc
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this),
                            complaint.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-muted-foreground truncate mt-1",
                                children: [
                                    "Location: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-foreground",
                                        children: [
                                            complaint.address,
                                            complaint.landmark ? ` (Landmark: ${complaint.landmark})` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-muted-foreground mt-1.5 uppercase tracking-wider",
                                children: complaint.complaint_id || complaint._id || "#CIV-NEW"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-end gap-3 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`,
                        children: status.label
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    complaint.priority && isInspector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `px-3 py-1 rounded-full text-xs font-bold ${complaint.priority === 'HIGH' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`,
                        children: complaint.priority
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "w-5 h-5 text-muted-foreground mt-auto"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
function QuickActionBtn({ icon: Icon, title, colorClass, bgClass, href }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "flex-1 min-h-[100px] rounded-2xl bg-card border border-border flex flex-col items-center justify-center p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-12 h-12 rounded-full ${bgClass} flex items-center justify-center mb-3`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: `w-6 h-6 ${colorClass}`
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 187,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs leading-snug font-bold text-foreground text-center whitespace-pre-line",
                children: title
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
// --- Dashboards ---
function CitizenDashboard() {
    const { data: rawData, isLoading: loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComplaints"])({
        page: 1,
        limit: 10
    });
    const data = rawData;
    const complaints = data?.data || [];
    const counts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (data?.meta?.status_counts) {
            return {
                open: data.meta.status_counts.OPEN || 0,
                active: (data.meta.status_counts.WORKING || 0) + (data.meta.status_counts.APPROVAL || 0),
                closed: data.meta.status_counts.CLOSED || 0,
                rejected: data.meta.status_counts.REJECTED || 0
            };
        }
        return {
            open: complaints.filter((c)=>c.status === "OPEN").length,
            active: complaints.filter((c)=>[
                    "WORKING",
                    "APPROVAL"
                ].includes(c.status)).length,
            closed: complaints.filter((c)=>c.status === "CLOSED").length,
            rejected: complaints.filter((c)=>c.status === "REJECTED").length
        };
    }, [
        complaints,
        data
    ]);
    const total = counts.open + counts.active + counts.closed + counts.rejected || 1;
    const openPct = counts.open / total * 100;
    const activePct = counts.active / total * 100;
    const closedPct = counts.closed / total * 100;
    const rejectedPct = counts.rejected / total * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-in fade-in slide-in-from-bottom-4 duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card/80 backdrop-blur-md rounded-3xl p-6 shadow-md border border-border mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center border-r border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-3xl font-black text-accent",
                                        children: counts.open
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1",
                                        children: "Pending"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center border-r border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-3xl font-black text-primary",
                                        children: counts.active
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1",
                                        children: "Active"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center border-r border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-3xl font-black text-success",
                                        children: counts.closed
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1",
                                        children: "Resolved"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-3xl font-black text-destructive",
                                        children: counts.rejected
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1",
                                        children: "Rejected"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 pt-6 border-t border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-bold text-foreground",
                                        children: "Complaint Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold text-muted-foreground",
                                        children: [
                                            total > 1 ? total : 0,
                                            " Total"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-3 bg-muted rounded-full overflow-hidden flex shadow-inner",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: `${openPct}%`
                                        },
                                        className: "bg-accent transition-all duration-1000"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: `${activePct}%`
                                        },
                                        className: "bg-primary transition-all duration-1000"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: `${closedPct}%`
                                        },
                                        className: "bg-success transition-all duration-1000"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: `${rejectedPct}%`
                                        },
                                        className: "bg-destructive transition-all duration-1000"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 md:px-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        left: "Quick Actions"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-3 md:gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"],
                                title: "Raise\\nComplaint",
                                colorClass: "text-primary",
                                bgClass: "bg-primary/10",
                                href: "/complaints/create"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                                title: "Track\\nStatus",
                                colorClass: "text-secondary",
                                bgClass: "bg-secondary/10",
                                href: "/complaints"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                                title: "Profile",
                                colorClass: "text-muted-foreground",
                                bgClass: "bg-muted",
                                href: "/profile"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        left: "My Complaints",
                        right: "View All",
                        rightHref: "/complaints"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-3xl shadow-sm overflow-hidden mb-8",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-10 flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 276,
                            columnNumber: 13
                        }, this) : complaints.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-10 text-center flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                        className: "w-8 h-8 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 18
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-bold text-foreground",
                                    children: "No complaints found"
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-muted-foreground mt-1",
                                    children: "You haven't raised any complaints yet."
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this) : complaints.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComplaintItem, {
                                complaint: c,
                                index: i,
                                total: complaints.length
                            }, c._id || c.id, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 289,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
function InspectorDashboard() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [wards, setWards] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedWardId, setSelectedWardId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const { data: rawRes, isLoading: isLoadingComplaints, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWardComplaints"])({
        ward_id: selectedWardId === "all" ? "" : selectedWardId,
        limit: 100
    });
    const res = rawRes;
    const [loadError, setLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingWards, setIsLoadingWards] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const complaints = res?.complaints || res?.data || (Array.isArray(res) ? res : []) || [];
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (res?.stats) return res.stats;
        const total = complaints.length;
        const pending = complaints.filter((c)=>[
                "OPEN",
                "PENDING"
            ].includes(c.status)).length;
        const in_progress = complaints.filter((c)=>[
                "IN_PROGRESS",
                "WORKING",
                "ACCEPTED",
                "FIELD_VISIT",
                "APPROVAL"
            ].includes(c.status)).length;
        const resolved = complaints.filter((c)=>[
                "RESOLVED",
                "CLOSED"
            ].includes(c.status)).length;
        const rejected = complaints.filter((c)=>c.status === "REJECTED").length;
        return {
            total,
            pending,
            in_progress,
            resolved,
            rejected
        };
    }, [
        complaints,
        res
    ]);
    const refreshData = ()=>{
        refetch();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function loadWards() {
            setIsLoadingWards(true);
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getAllWards({
                    limit: 100
                });
                let wardsList = [];
                if (Array.isArray(res)) wardsList = res;
                else if (Array.isArray(res?.data)) wardsList = res.data;
                else if (Array.isArray(res?.wards)) wardsList = res.wards;
                setWards(wardsList);
            } catch (error) {
                setLoadError("Failed to load wards.");
            } finally{
                setIsLoadingWards(false);
            }
        }
        loadWards();
    }, []);
    const filteredComplaints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return complaints.filter((c)=>{
            if (statusFilter !== "All") {
                if (statusFilter === "Pending" && ![
                    "OPEN",
                    "PENDING"
                ].includes(c.status)) return false;
                if (statusFilter === "In Progress" && ![
                    "IN_PROGRESS",
                    "WORKING",
                    "ACCEPTED",
                    "FIELD_VISIT",
                    "APPROVAL"
                ].includes(c.status)) return false;
                if (statusFilter === "Resolved" && ![
                    "RESOLVED",
                    "CLOSED"
                ].includes(c.status)) return false;
                if (statusFilter === "Rejected" && c.status !== "REJECTED") return false;
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const idMatch = (c.complaint_id || "").toLowerCase().includes(q);
                const typeMatch = (c.complaint_type || "").toLowerCase().includes(q);
                const locMatch = (c.address || "").toLowerCase().includes(q);
                const nameMatch = (c.citizen?.name || "").toLowerCase().includes(q);
                if (!idMatch && !typeMatch && !locMatch && !nameMatch) return false;
            }
            return true;
        });
    }, [
        complaints,
        statusFilter,
        searchQuery
    ]);
    if (isLoadingWards) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 flex flex-col items-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-medium text-slate-500",
                    children: "Loading wards…"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
            lineNumber: 371,
            columnNumber: 7
        }, this);
    }
    if (loadError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 text-center flex flex-col items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-8 h-8 text-red-500"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-base font-bold text-slate-800",
                    children: "Ward Load Error"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 384,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-medium text-slate-500 mt-1",
                    children: loadError
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 385,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    className: "mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors",
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 386,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
            lineNumber: 380,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-in fade-in slide-in-from-bottom-4 duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0 flex flex-wrap items-center justify-between",
                children: [
                    {
                        label: "Total",
                        value: stats.total || 0,
                        filter: "All",
                        color: "text-slate-800"
                    },
                    {
                        label: "Pending",
                        value: stats.pending || 0,
                        filter: "Pending",
                        color: "text-teal-600"
                    },
                    {
                        label: "In Progress",
                        value: stats.in_progress || 0,
                        filter: "In Progress",
                        color: "text-teal-500"
                    },
                    {
                        label: "Resolved",
                        value: stats.resolved || 0,
                        filter: "Resolved",
                        color: "text-teal-400"
                    },
                    {
                        label: "Rejected",
                        value: stats.rejected || 0,
                        filter: "Rejected",
                        color: "text-red-500"
                    }
                ].map((s, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setStatusFilter(s.filter),
                        className: `flex-1 text-center py-2 px-2 hover:bg-slate-50 rounded-xl transition-colors ${idx !== 4 ? 'border-r border-slate-100' : ''} ${statusFilter === s.filter ? 'ring-2 ring-teal-100 bg-teal-50/50' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-3xl font-black ${s.color}`,
                                children: s.value
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1",
                                children: s.label
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this)
                        ]
                    }, s.label, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 402,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 md:px-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-slate-800",
                                        children: "Select Ward"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedWardId,
                                        onChange: (e)=>setSelectedWardId(e.target.value),
                                        className: "bg-white text-slate-700 font-semibold text-sm px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[200px] shadow-sm cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All Wards"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this),
                                            wards.map((ward)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: ward._id || ward.id,
                                                    children: [
                                                        ward.ward_name,
                                                        " (Ward #",
                                                        ward.ward_number,
                                                        ")"
                                                    ]
                                                }, ward._id || ward.id, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 416,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 max-w-md mt-6 md:mt-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 433,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search ID, type, location or name...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-8",
                        children: [
                            "All",
                            "Pending",
                            "In Progress",
                            "Resolved",
                            "Rejected"
                        ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setStatusFilter(filter),
                                className: `px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex items-center ${statusFilter === filter ? "bg-teal-600 text-white shadow-teal-500/30 ring-2 ring-teal-200 ring-offset-1" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`,
                                children: [
                                    filter,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-2 px-2 py-0.5 rounded-full text-xs font-black ${statusFilter === filter ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-500'}`,
                                        children: filter === "All" ? stats.total : filter === "Pending" ? stats.pending : filter === "In Progress" ? stats.in_progress : filter === "Resolved" ? stats.resolved : stats.rejected
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, filter, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 447,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-slate-800",
                                        children: selectedWardId === "all" ? "All Complaints" : `Complaints in ${wards.find((w)=>(w._id || w.id) === selectedWardId)?.ward_name || "Selected Ward"}`
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 467,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>refreshData(),
                                        className: "text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-2 transition-colors",
                                        children: [
                                            "Refresh ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 471,
                                                columnNumber: 24
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 470,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "w-full text-left border-collapse whitespace-nowrap",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b border-slate-100 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Complaint ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 479,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 480,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Location"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 481,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 482,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Status"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5",
                                                        children: "Priority"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 484,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "p-5 text-right",
                                                        children: "Action"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 477,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: isLoadingComplaints ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 7,
                                                    className: "p-10 text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                        lineNumber: 492,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 490,
                                                columnNumber: 19
                                            }, this) : filteredComplaints.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 7,
                                                    className: "p-10 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                                className: "w-8 h-8 text-slate-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 499,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 498,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-base font-bold text-slate-700",
                                                            children: "No complaints found"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-slate-500 mt-1",
                                                            children: "Try adjusting your filters or search query."
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 19
                                            }, this) : filteredComplaints.map((c)=>{
                                                const statusStyles = STATUS_STYLES[c.status] || STATUS_STYLES.OPEN;
                                                const typeMeta = TYPE_META[c.complaint_type] || TYPE_META.OTHER;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    onClick: ()=>router.push(`/complaints/${c.id || c._id || c.complaint_id}`),
                                                    className: "border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-black text-slate-700 hover:text-teal-600 transition-colors",
                                                                    children: c.complaint_id || "#CIV-NEW"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                    lineNumber: 517,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-medium text-slate-500 mt-0.5",
                                                                    children: c.citizen?.name || "Citizen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                    lineNumber: 518,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 516,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `w-8 h-8 rounded-lg ${typeMeta.bg} flex items-center justify-center shrink-0`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(typeMeta.icon, {
                                                                            className: `w-4 h-4 ${typeMeta.color}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                            lineNumber: 523,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                        lineNumber: 522,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-bold text-slate-700",
                                                                        children: typeMeta.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 520,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-slate-600 max-w-[200px] truncate",
                                                                title: c.address,
                                                                children: c.address || "No address provided"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-slate-600",
                                                                children: c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                }) : "N/A"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 532,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-3 py-1 rounded-full text-xs font-bold ${statusStyles.bg} ${statusStyles.color}`,
                                                                children: statusStyles.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 537,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-3 py-1 rounded-full text-xs font-bold ${c.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`,
                                                                children: c.priority || "MEDIUM"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 542,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 541,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "p-5 text-right",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/complaints/${c.id || c._id || c.complaint_id}`,
                                                                className: "inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-teal-100 hover:text-teal-700 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                    lineNumber: 548,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                                lineNumber: 547,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                            lineNumber: 546,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, c.id || c._id || c.complaint_id, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 488,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 392,
        columnNumber: 5
    }, this);
}
function AdminDashboard() {
    const { data, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAdminDashboard"])();
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 flex justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 570,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
            lineNumber: 569,
            columnNumber: 7
        }, this);
    }
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 text-center flex flex-col items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                        className: "w-8 h-8 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 579,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 578,
                    columnNumber: 10
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-base font-bold text-foreground",
                    children: "No data available"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 581,
                    columnNumber: 10
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
            lineNumber: 577,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                left: "Quick Actions"
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 588,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
                        title: "Create\\nDistrict",
                        colorClass: "text-primary",
                        bgClass: "bg-primary/10",
                        href: "/settings/district/create"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 590,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                        title: "Create\\nInspector",
                        colorClass: "text-[#7C3AED]",
                        bgClass: "bg-[#7C3AED]/10",
                        href: "/settings/inspector/create"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 591,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
                        title: "Create\\nWorker",
                        colorClass: "text-[#059669]",
                        bgClass: "bg-[#059669]/10",
                        href: "/settings/worker/create"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickActionBtn, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                        title: "Reports",
                        colorClass: "text-accent",
                        bgClass: "bg-accent/10",
                        href: "/reports"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 593,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 589,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                left: "District Overview"
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 596,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
                        value: data.stats?.total_wards || 0,
                        label: "Wards",
                        colorClass: "text-primary",
                        bgClass: "bg-primary/10"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 598,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
                        value: data.stats?.total_inspectors || 0,
                        label: "Inspectors",
                        colorClass: "text-secondary",
                        bgClass: "bg-secondary/10"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 599,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                        value: data.stats?.total_complaints || 0,
                        label: "Complaints",
                        colorClass: "text-accent",
                        bgClass: "bg-accent/10"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
                        value: data.stats?.resolved_complaints || 0,
                        label: "Resolved",
                        colorClass: "text-success",
                        bgClass: "bg-success/10"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 601,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 587,
        columnNumber: 5
    }, this);
}
function WorkerDashboard() {
    const { data, isLoading: loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$dashboard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWorkerDashboard"])();
    const dashboard = data?.data || data || null;
    const tasks = dashboard?.assigned_tasks || {};
    const assignments = dashboard?.recent_assignments || [];
    const completionRate = dashboard?.completion_rate || 0;
    const stats = {
        total: tasks.total || 0,
        pending: tasks.pending || 0,
        completed: tasks.completed || 0
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-in fade-in slide-in-from-bottom-4 duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 mt-[-3rem] relative z-10 mx-4 md:mx-0 flex flex-wrap items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 text-center py-2 px-2 border-r border-slate-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-black text-slate-800",
                                children: stats.total
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 625,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1",
                                children: "Total"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 626,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 624,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 text-center py-2 px-2 border-r border-slate-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-black text-[#D97706]",
                                children: stats.pending
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 629,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1",
                                children: "Pending"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 630,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 628,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 text-center py-2 px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-black text-[#059669]",
                                children: stats.completed
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 633,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-bold text-slate-500 uppercase tracking-widest mt-1",
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 634,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 632,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 623,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 md:px-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        left: "My Tasks"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 639,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-3 md:gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
                                value: stats.total,
                                label: "Assigned",
                                colorClass: "text-primary",
                                bgClass: "bg-primary/10"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
                                value: stats.pending,
                                label: "Pending",
                                colorClass: "text-[#D97706]",
                                bgClass: "bg-[#FEF3C7]"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 642,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
                                value: stats.completed,
                                label: "Completed",
                                colorClass: "text-[#059669]",
                                bgClass: "bg-[#D1FAE5]"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 643,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 640,
                        columnNumber: 9
                    }, this),
                    completionRate > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                                left: "Performance"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 648,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-card border border-border rounded-2xl p-6 shadow-sm mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-muted-foreground",
                                                children: "Completion Rate"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl font-bold text-primary",
                                                children: [
                                                    completionRate,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 650,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-2 bg-muted rounded-full overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: `${completionRate}%`
                                            },
                                            className: "h-full bg-primary transition-all duration-1000"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 655,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 649,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        left: "Recent Assignments",
                        right: "View All",
                        rightHref: "/complaints"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 661,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-3xl shadow-sm overflow-hidden mb-8",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-10 flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 665,
                                columnNumber: 16
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 664,
                            columnNumber: 14
                        }, this) : assignments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-10 text-center flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                        className: "w-8 h-8 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 670,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 669,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-bold text-foreground",
                                    children: "No tasks assigned"
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 672,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 668,
                            columnNumber: 14
                        }, this) : assignments.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComplaintItem, {
                                complaint: c,
                                index: i,
                                total: assignments.length
                            }, c._id || c.id || c.complaint_id, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 676,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 662,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 638,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 622,
        columnNumber: 5
    }, this);
}
function DashboardPage() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const role = user?.role || "CITIZEN";
    const roleMeta = ROLE_META[role] || ROLE_META.CITIZEN;
    const greeting = ROLE_GREETING[role] || ROLE_GREETING.CITIZEN;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 bg-background relative pb-20 md:pb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `bg-gradient-to-br ${roleMeta.gradient} pt-12 pb-24 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                            className: "w-7 h-7 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 699,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 698,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-black text-white tracking-wide",
                                                children: greeting.title
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 702,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-white/80 mt-1",
                                                children: greeting.sub
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 703,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 701,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                lineNumber: 697,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 696,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex items-center gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-xl",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl font-black text-white",
                                        children: user?.name ? user.name.substring(0, 2).toUpperCase() : "US"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                        lineNumber: 711,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 710,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-black text-white mb-1",
                                            children: user?.name || "Welcome Back"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 716,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mt-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-4 py-1.5 rounded-full text-xs font-black ${roleMeta.bg} ${roleMeta.color} border border-white/10`,
                                                children: roleMeta.label
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                                lineNumber: 718,
                                                columnNumber: 15
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                            lineNumber: 717,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                                    lineNumber: 715,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                            lineNumber: 709,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                    lineNumber: 695,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 694,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto w-full md:px-12",
                children: [
                    role === "CITIZEN" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CitizenDashboard, {}, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 728,
                        columnNumber: 32
                    }, this),
                    role === "INSPECTOR" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InspectorDashboard, {}, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 729,
                        columnNumber: 34
                    }, this),
                    role === "WORKER" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkerDashboard, {}, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 730,
                        columnNumber: 31
                    }, this),
                    (role === "SUPER_ADMIN" || role === "DISTRICT_ADMIN") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminDashboard, {}, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                        lineNumber: 731,
                        columnNumber: 67
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
                lineNumber: 727,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/dashboard/page.tsx",
        lineNumber: 692,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=civifix-web_src_502835ef._.js.map