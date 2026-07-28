module.exports = [
"[project]/civifix-web/src/hooks/use-wards.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWards",
    ()=>useWards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/auth.ts [app-ssr] (ecmascript)");
;
;
function useWards(districtId, params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "wards",
            districtId,
            params
        ],
        queryFn: ()=>{
            if (districtId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getWardsByDistrict(districtId, params);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getWards(params);
        },
        enabled: !!districtId
    });
}
}),
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
"[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateComplaintPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/context/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$wards$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/hooks/use-wards.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/hooks/use-complaints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map.mjs [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/clipboard-list.mjs [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-ssr] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/lightbulb.mjs [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/tree-pine.mjs [app-ssr] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$navigation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/navigation.mjs [app-ssr] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/send.mjs [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
;
;
;
;
const COMPLAINT_TYPES = [
    {
        value: "GARBAGE",
        label: "Garbage / Waste",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        value: "ROAD_DAMAGE",
        label: "Road Damage",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10"
    },
    {
        value: "POTHOLE",
        label: "Pothole",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10"
    },
    {
        value: "STREETLIGHT",
        label: "Street Light",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        value: "WATER_SUPPLY",
        label: "Water Supply",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        value: "DRAINAGE",
        label: "Drainage Issue",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        value: "SANITATION",
        label: "Sanitation",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        value: "TREE_CUTTING",
        label: "Tree / Fallen Branch",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
        color: "text-success",
        bg: "bg-success/10"
    },
    {
        value: "CONSTRUCTION",
        label: "Construction Block",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        color: "text-accent",
        bg: "bg-accent/10"
    },
    {
        value: "OTHER",
        label: "Other Issue",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        color: "text-destructive",
        bg: "bg-destructive/10"
    }
];
const PRIORITIES = [
    {
        value: "LOW",
        label: "Low",
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"]
    },
    {
        value: "MEDIUM",
        label: "Medium",
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
    },
    {
        value: "HIGH",
        label: "High",
        color: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
    }
];
function CreateComplaintPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        ward_id: "",
        complaint_type: "",
        description: "",
        latitude: "",
        longitude: "",
        address: "",
        landmark: "",
        citizen_note: "",
        priority: "MEDIUM"
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [serverError, setServerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [gpsLoading, setGpsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSuccess, setShowSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedImages, setSelectedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [createdComplaint, setCreatedComplaint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const { data: wardsData, isLoading: wardsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$wards$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWards"])(user?.district_id || user?.district);
    const wards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const rawWards = wardsData?.data || [];
        return [
            ...rawWards
        ].sort((a, b)=>{
            const numA = parseInt(a.ward_number, 10);
            const numB = parseInt(b.ward_number, 10);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            const labelA = a.ward_name || "";
            const labelB = b.ward_name || "";
            return labelA.localeCompare(labelB, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });
    }, [
        wardsData
    ]);
    const createComplaint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCreateComplaint"])();
    const updateField = (field, value)=>{
        setForm((prev)=>({
                ...prev,
                [field]: value
            }));
        if (errors[field]) setErrors((prev)=>({
                ...prev,
                [field]: ""
            }));
    };
    const handleGetLocation = ()=>{
        setGpsLoading(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setGpsLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);
            updateField("latitude", lat);
            updateField("longitude", lon);
            if (errors.location) setErrors((prev)=>({
                    ...prev,
                    location: ""
                }));
            try {
                const deduplicateAddress = (addressStr)=>{
                    if (!addressStr) return "";
                    const rawParts = addressStr.split(",");
                    const cleanedParts = [];
                    const seenNormalized = new Set();
                    for (const part of rawParts){
                        const trimmed = part.trim();
                        if (!trimmed) continue;
                        if (trimmed.toLowerCase() === "india") continue;
                        let normalized = trimmed.toLowerCase();
                        normalized = normalized.replace(/\b(district|municipality|taluk|state|city|town|village|county)\b/g, "");
                        normalized = normalized.replace(/\s+/g, "").trim();
                        if (!normalized) continue;
                        let isDuplicate = false;
                        for (const seen of seenNormalized){
                            if (seen.includes(normalized) || normalized.includes(seen) || normalized.substring(0, 5) === seen.substring(0, 5)) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate) {
                            seenNormalized.add(normalized);
                            cleanedParts.push(trimmed);
                        }
                    }
                    if (cleanedParts.length >= 2) {
                        const last = cleanedParts[cleanedParts.length - 1];
                        const prev = cleanedParts[cleanedParts.length - 2];
                        const isPostalCode = /^\d{6}$/.test(last);
                        if (isPostalCode) {
                            cleanedParts.splice(cleanedParts.length - 2, 2, `${prev} ${last}`);
                        }
                    }
                    return cleanedParts.join(", ");
                };
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await res.json();
                if (data && data.address) {
                    const addr = data.address;
                    let formatted = "";
                    if (data.display_name) {
                        formatted = deduplicateAddress(data.display_name);
                    }
                    if (!formatted || formatted.split(",").length < 3) {
                        const parts = [];
                        const streetPart = [];
                        if (addr.house_number || addr.house || addr.flat || addr.apartment || addr.unit) {
                            streetPart.push(addr.house_number || addr.house || addr.flat || addr.apartment || addr.unit);
                        }
                        if (addr.building || addr.amenity || addr.landmark || addr.shop || addr.office) {
                            streetPart.push(addr.building || addr.amenity || addr.landmark || addr.shop || addr.office);
                        }
                        if (addr.road || addr.street || addr.pedestrian || addr.footway) {
                            streetPart.push(addr.road || addr.street || addr.pedestrian || addr.footway);
                        }
                        if (streetPart.length > 0) {
                            parts.push(streetPart.join(" "));
                        }
                        const locality = addr.suburb || addr.neighbourhood || addr.village || addr.sublocality || addr.residential || addr.hamlet;
                        if (locality) parts.push(locality);
                        if (addr.ward) parts.push(addr.ward);
                        const city = addr.city || addr.town || addr.municipality;
                        if (city) {
                            parts.push(city);
                        } else if (addr.county || addr.state_district) {
                            parts.push(addr.county || addr.state_district);
                        }
                        const regionPart = [];
                        if (addr.state || addr.province) regionPart.push(addr.state || addr.province);
                        if (addr.postcode) regionPart.push(addr.postcode);
                        if (regionPart.length > 0) parts.push(regionPart.join(" "));
                        formatted = deduplicateAddress(parts.join(", "));
                    }
                    updateField("address", formatted || `${lat}, ${lon}`);
                } else {
                    throw new Error("Invalid geocoding response");
                }
            } catch (error) {
                console.error("Failed to reverse geocode:", error);
                updateField("address", `${lat}, ${lon}`);
            }
            setGpsLoading(false);
        }, (error)=>{
            console.error(error);
            alert("Unable to retrieve your location");
            setGpsLoading(false);
        });
    };
    const validate = ()=>{
        const next = {};
        if (!form.ward_id) next.ward_id = "Please select a ward";
        if (!form.complaint_type) next.complaint_type = "Please select a complaint type";
        if (form.description.trim().length < 10) next.description = "Description must be at least 10 characters";
        if (!form.latitude || !form.longitude) next.location = "Please use your current location to proceed";
        if (!form.address || !form.address.trim()) next.address = "Address is required";
        if (!form.landmark || !form.landmark.trim()) next.landmark = "Landmark / Door No. is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError("");
        try {
            const formData = new FormData();
            formData.append("ward_id", form.ward_id);
            formData.append("complaint_type", form.complaint_type);
            formData.append("description", form.description);
            formData.append("priority", form.priority);
            formData.append("latitude", form.latitude);
            formData.append("longitude", form.longitude);
            if (form.address) formData.append("address", form.address);
            if (form.landmark) formData.append("landmark", form.landmark);
            if (form.citizen_note) formData.append("citizen_note", form.citizen_note.trim());
            if (selectedImages.length === 0) {
                formData.append("images", new Blob([
                    ""
                ], {
                    type: "application/octet-stream"
                }), "");
            } else {
                selectedImages.forEach((file)=>{
                    formData.append("images", file);
                });
            }
            console.log("Submitting Complaint Payload:");
            formData.forEach((value, key)=>{
                console.log(`- ${key}:`, value);
            });
            const result = await createComplaint.mutateAsync(formData);
            setCreatedComplaint(result);
            setShowSuccess(true);
        } catch (err) {
            console.error("Submission failed!", err);
            console.error("Backend Response Data:", err?.response?.data);
            __turbopack_context__.A("[project]/civifix-web/src/lib/api.ts [app-ssr] (ecmascript, async loader)").then(({ getErrorMessage })=>{
                setServerError(getErrorMessage(err, "Failed to create complaint"));
            });
        } finally{
            setLoading(false);
        }
    };
    if (showSuccess && createdComplaint) {
        const complaintId = createdComplaint.complaint_id || createdComplaint.id || "N/A";
        const status = createdComplaint.status || "OPEN";
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 bg-background flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 min-h-[calc(100vh-100px)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-xl shadow-success/10 border border-success/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "w-12 h-12"
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 280,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-black text-foreground mb-2",
                        children: "Complaint Submitted!"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-muted/30 rounded-2xl p-4 mb-6 text-left border border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-3 pb-3 border-b border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-muted-foreground",
                                        children: "Complaint ID"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-extrabold text-foreground",
                                        children: complaintId
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-3 pb-3 border-b border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-muted-foreground",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-black text-accent bg-accent/10 px-3 py-1 rounded-full",
                                        children: status
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-muted-foreground",
                                        children: "Est. Resolution"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-bold text-foreground",
                                        children: "48 hours"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/dashboard"),
                                className: "flex-1 py-3.5 px-4 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-2xl transition-colors",
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/complaints/${createdComplaint._id || createdComplaint.id}`),
                                className: "flex-1 py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-colors shadow-md shadow-primary/20",
                                children: "View Complaint"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
            lineNumber: 278,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 bg-background relative pb-20 md:pb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-primary pt-12 pb-24 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-3xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-black text-white tracking-tight",
                            children: "Raise a Complaint"
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                            lineNumber: 324,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-white/80 font-semibold mt-2 text-sm",
                            children: "Help us fix your community by reporting an issue."
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                            lineNumber: 325,
                            columnNumber: 12
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                    lineNumber: 323,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card rounded-[2rem] p-6 shadow-md border border-border mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-primary transition-all duration-500",
                                            style: {
                                                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 333,
                                            columnNumber: 16
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        1,
                                        2,
                                        3
                                    ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'bg-muted text-muted-foreground border-2 border-border'}`,
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 336,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between mt-3 px-1 text-xs font-bold text-muted-foreground uppercase tracking-widest",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: step >= 1 ? 'text-primary' : '',
                                        children: "Issue"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: step >= 2 ? 'text-primary' : '',
                                        children: "Location"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: step >= 3 ? 'text-primary' : '',
                                        children: "Review"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `transition-all duration-500 ${step === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-bold text-foreground",
                                                            children: "What's the issue?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 358,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground",
                                                            children: "Type, description and priority"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                            children: "Complaint Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: form.complaint_type,
                                                                    onChange: (e)=>updateField("complaint_type", e.target.value),
                                                                    className: `w-full appearance-none bg-muted/30 border-2 ${errors.complaint_type ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-bold text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            disabled: true,
                                                                            children: "Select a category"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 372,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        COMPLAINT_TYPES.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: t.value,
                                                                                children: t.label
                                                                            }, t.value, false, {
                                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                                lineNumber: 374,
                                                                                columnNumber: 25
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 367,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 366,
                                                            columnNumber: 19
                                                        }, this),
                                                        errors.complaint_type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                            children: errors.complaint_type
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 379,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                            children: "Description"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            value: form.description,
                                                            onChange: (e)=>updateField("description", e.target.value),
                                                            placeholder: "Describe the issue clearly (min 10 characters)",
                                                            rows: 4,
                                                            className: `w-full bg-muted/30 border-2 ${errors.description ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none`
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 19
                                                        }, this),
                                                        errors.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                            children: errors.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-3 uppercase",
                                                            children: "Priority"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-3",
                                                            children: PRIORITIES.map((p)=>{
                                                                const isSelected = form.priority === p.value;
                                                                const Icon = p.icon;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>updateField("priority", p.value),
                                                                    className: `flex-1 flex flex-col items-center gap-2 py-4 border-2 rounded-2xl transition-all duration-200 ${isSelected ? `${p.bg} ${p.border} ${p.color} ring-4 ring-${p.color.split('-')[1]}/10` : 'border-border bg-card text-muted-foreground hover:bg-muted/50'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                                            className: "w-6 h-6"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-extrabold",
                                                                            children: p.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 410,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, p.value, true, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 401,
                                                                    columnNumber: 25
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                            children: "Upload Photos (Optional)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors relative cursor-pointer group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "file",
                                                                    multiple: true,
                                                                    accept: "image/*",
                                                                    className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10",
                                                                    onChange: (e)=>{
                                                                        if (e.target.files) {
                                                                            setSelectedImages([
                                                                                ...selectedImages,
                                                                                ...Array.from(e.target.files)
                                                                            ]);
                                                                        }
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        className: "w-6 h-6 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                        lineNumber: 432,
                                                                        columnNumber: 24
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 431,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-bold text-foreground",
                                                                    children: "Tap or drag images here"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 434,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-medium text-muted-foreground mt-1",
                                                                    children: "PNG, JPG up to 10MB"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 19
                                                        }, this),
                                                        selectedImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-3 mt-4",
                                                            children: selectedImages.map((file, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative w-20 h-20 rounded-xl overflow-hidden border border-border group shadow-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                            src: URL.createObjectURL(file),
                                                                            alt: "Preview",
                                                                            className: "w-full h-full object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 442,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: (e)=>{
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setSelectedImages(selectedImages.filter((_, index)=>index !== i));
                                                                            },
                                                                            className: "absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                                lineNumber: 452,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 443,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex justify-end",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    let isValid = true;
                                                    if (!form.complaint_type) {
                                                        updateField("complaint_type", "");
                                                        isValid = false;
                                                    }
                                                    if (form.description.length < 10) {
                                                        updateField("description", "");
                                                        isValid = false;
                                                    }
                                                    if (isValid) setStep(2);
                                                },
                                                className: "py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-sm tracking-wide shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5",
                                                children: "Continue"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 461,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                    lineNumber: 352,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `transition-all duration-500 ${step === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-bold text-foreground",
                                                            children: "Where is it?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground",
                                                            children: "Ward, address & GPS location"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 481,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                            children: "Ward"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 493,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: form.ward_id,
                                                                    onChange: (e)=>updateField("ward_id", e.target.value),
                                                                    disabled: wardsLoading,
                                                                    className: `w-full appearance-none bg-muted/30 border-2 ${errors.ward_id ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-bold text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 disabled:opacity-50`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            disabled: true,
                                                                            children: wardsLoading ? "Loading wards..." : "Select your ward"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                            lineNumber: 501,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        wards.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: w._id || w.id,
                                                                                children: [
                                                                                    w.ward_number ? `${String(w.ward_number).padStart(2, "0")} - ` : "",
                                                                                    w.ward_name
                                                                                ]
                                                                            }, w._id || w.id, true, {
                                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                                lineNumber: 503,
                                                                                columnNumber: 25
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 494,
                                                            columnNumber: 19
                                                        }, this),
                                                        errors.ward_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                            children: errors.ward_id
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 510,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 17
                                                }, this),
                                                errors.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                    children: errors.location
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleGetLocation,
                                                    disabled: gpsLoading,
                                                    className: "w-full flex items-center justify-center gap-2 py-4 bg-primary/10 text-primary hover:bg-primary/20 border-2 border-primary/20 rounded-2xl transition-all duration-200 font-bold text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$navigation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"], {
                                                            className: `w-5 h-5 ${gpsLoading ? 'animate-spin' : ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 19
                                                        }, this),
                                                        gpsLoading ? "Getting location..." : "Use my current location"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 17
                                                }, this),
                                                (form.latitude || form.longitude) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 bg-success/10 border border-success/30 rounded-2xl p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "w-5 h-5 text-success shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1 text-sm font-bold text-success truncate",
                                                            children: [
                                                                form.latitude,
                                                                ", ",
                                                                form.longitude
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                updateField("latitude", "");
                                                                updateField("longitude", "");
                                                            },
                                                            className: "p-1 hover:bg-success/20 rounded-lg text-success",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                lineNumber: 536,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 526,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                                    children: "Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 543,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: form.address,
                                                                    onChange: (e)=>updateField("address", e.target.value),
                                                                    placeholder: "Address will be auto-filled by GPS",
                                                                    className: `w-full bg-muted/30 border-2 ${errors.address ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 21
                                                                }, this),
                                                                errors.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                                    children: errors.address
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 551,
                                                                    columnNumber: 40
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                                    children: "Landmark / Door No."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 555,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: form.landmark,
                                                                    onChange: (e)=>updateField("landmark", e.target.value),
                                                                    placeholder: "Example: Near Government School, No. 64/13 Rayan Kuttai Street",
                                                                    className: `w-full bg-muted/30 border-2 ${errors.landmark ? 'border-destructive' : 'border-border'} rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 556,
                                                                    columnNumber: 21
                                                                }, this),
                                                                errors.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-destructive text-xs font-bold mt-1.5 ml-1",
                                                                    children: errors.landmark
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 563,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 491,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setStep(1),
                                                    className: "py-4 px-6 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-black text-sm tracking-wide transition-all",
                                                    children: "Back"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 569,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        let isValid = true;
                                                        if (!form.ward_id) {
                                                            updateField("ward_id", "");
                                                            isValid = false;
                                                        }
                                                        if (!form.latitude || !form.longitude) {
                                                            setErrors((prev)=>({
                                                                    ...prev,
                                                                    location: "Please use your current location to proceed"
                                                                }));
                                                            isValid = false;
                                                        }
                                                        if (isValid) setStep(3);
                                                    },
                                                    className: "py-4 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-sm tracking-wide shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5",
                                                    children: "Continue"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 568,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 479,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `transition-all duration-500 ${step === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4 mb-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "w-6 h-6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                        lineNumber: 600,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-lg font-bold text-foreground",
                                                            children: "Review & Submit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 603,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold text-muted-foreground",
                                                            children: "Add any final notes"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 598,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                                    children: "Citizen Note (Optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: form.citizen_note,
                                                    onChange: (e)=>updateField("citizen_note", e.target.value),
                                                    placeholder: "Anything else we should know?",
                                                    rows: 3,
                                                    className: "w-full bg-muted/30 border-2 border-border rounded-2xl px-5 py-4 text-sm font-medium text-foreground outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 608,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 bg-muted/50 rounded-2xl p-4 border border-border/50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3",
                                                    children: "Summary"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 620,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-sm font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Type:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 622,
                                                                    columnNumber: 58
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-foreground",
                                                                    children: COMPLAINT_TYPES.find((t)=>t.value === form.complaint_type)?.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 622,
                                                                    columnNumber: 111
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 622,
                                                            columnNumber: 20
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Priority:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 623,
                                                                    columnNumber: 58
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-foreground",
                                                                    children: form.priority
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 623,
                                                                    columnNumber: 115
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 623,
                                                            columnNumber: 20
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Ward:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 624,
                                                                    columnNumber: 58
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-foreground truncate ml-4",
                                                                    children: wards.find((w)=>w._id === form.ward_id)?.ward_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 624,
                                                                    columnNumber: 111
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 624,
                                                            columnNumber: 20
                                                        }, this),
                                                        selectedImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Attachments:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 626,
                                                                    columnNumber: 60
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-foreground",
                                                                    children: [
                                                                        selectedImages.length,
                                                                        " photo(s)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                    lineNumber: 626,
                                                                    columnNumber: 120
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 22
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 15
                                        }, this),
                                        serverError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-5 rounded-2xl flex items-center gap-3 mt-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    className: "w-6 h-6 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 633,
                                                    columnNumber: 19
                                                }, this),
                                                serverError
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 632,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex justify-between gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setStep(2),
                                                    className: "py-4 px-6 bg-muted hover:bg-muted/80 text-foreground rounded-2xl font-black text-sm tracking-wide transition-all",
                                                    children: "Back"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 639,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: loading,
                                                    className: "flex-1 py-4 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5",
                                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Submitting..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                        lineNumber: 652,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Submit Complaint"
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                            lineNumber: 638,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                    lineNumber: 597,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                                lineNumber: 596,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                        lineNumber: 348,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/create/page.tsx",
        lineNumber: 320,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=civifix-web_src_02d0fa03._.js.map