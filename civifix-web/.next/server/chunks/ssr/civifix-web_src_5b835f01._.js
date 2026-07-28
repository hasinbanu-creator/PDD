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
"[project]/civifix-web/src/services/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "complaintsApi",
    ()=>complaintsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/constants/endpoints.ts [app-ssr] (ecmascript)");
;
;
const complaintsApi = {
    updateStatus: async (id, status)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/complaints/${id}/status`, {
            status
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    addNote: async (id, payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/complaints/${id}/note`, payload);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    submitFeedback: async (id, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].SUBMIT_FEEDBACK(id), null, {
            params: data
        });
        return response.data;
    },
    reopenComplaint: async (id, reason)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].REOPEN_COMPLAINT(id), null, {
            params: {
                reason
            }
        });
        return response.data;
    },
    resolveComplaintWithImages: async (id, formData)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/inspector/complaints/${id}/resolve`, formData);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    }
};
}),
"[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ComplaintDetailsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/constants/endpoints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/hooks/use-complaints.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map.mjs [app-ssr] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/clipboard-list.mjs [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/wrench.mjs [app-ssr] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/tree-pine.mjs [app-ssr] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/lightbulb.mjs [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/folder-open.mjs [app-ssr] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/info.mjs [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$navigation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/navigation.mjs [app-ssr] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/user.mjs [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$hat$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HardHat$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/hard-hat.mjs [app-ssr] (ecmascript) <export default as HardHat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/play.mjs [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/history.mjs [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/civifix-web/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.mjs [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/context/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/civifix-web/src/services/api.ts [app-ssr] (ecmascript)");
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
;
const STATUS_CONFIG = {
    PENDING: {
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        label: "Pending"
    },
    OPEN: {
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"],
        label: "Open"
    },
    ASSIGNED: {
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$hat$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HardHat$3e$__["HardHat"],
        label: "Assigned"
    },
    WORKING: {
        color: "text-secondary",
        bg: "bg-secondary/10",
        border: "border-secondary/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        label: "In Progress"
    },
    IN_PROGRESS: {
        color: "text-secondary",
        bg: "bg-secondary/10",
        border: "border-secondary/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        label: "In Progress"
    },
    CLOSED: {
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        label: "Resolved"
    },
    RESOLVED: {
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        label: "Resolved"
    },
    REJECTED: {
        color: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        label: "Rejected"
    }
};
const PRIORITY_CONFIG = {
    LOW: {
        color: "text-success",
        bg: "bg-success/10",
        label: "Low"
    },
    MEDIUM: {
        color: "text-accent",
        bg: "bg-accent/10",
        label: "Medium"
    },
    HIGH: {
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: "High"
    },
    CRITICAL: {
        color: "text-destructive",
        bg: "bg-destructive/20",
        label: "Critical"
    }
};
const TYPE_META = {
    ROAD_DAMAGE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Road Damage"
    },
    GARBAGE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        color: "text-secondary",
        bg: "bg-secondary/10",
        title: "Waste Collection"
    },
    POTHOLE: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Pothole"
    },
    STREETLIGHT: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
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
        title: "Drainage Issue"
    },
    SANITATION: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
        color: "text-secondary",
        bg: "bg-secondary/10",
        title: "Sanitation"
    },
    TREE_CUTTING: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
        color: "text-success",
        bg: "bg-success/10",
        title: "Tree Issue"
    },
    CONSTRUCTION: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
        color: "text-accent",
        bg: "bg-accent/10",
        title: "Construction Block"
    },
    OTHER: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        color: "text-destructive",
        bg: "bg-destructive/10",
        title: "Civic Issue"
    }
};
function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start gap-4 mb-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mt-1 border border-border/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "w-5 h-5 text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-1",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-foreground leading-relaxed",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
function NoteCard({ icon: Icon, label, value, colorClass, borderClass, bgClass }) {
    if (!value) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `border-l-4 ${borderClass} bg-muted/30 rounded-2xl p-5 mb-4`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: `w-5 h-5 ${colorClass}`
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-sm font-bold ${colorClass}`,
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium text-muted-foreground leading-relaxed",
                children: value
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
const getFinalImageUri = (img)=>{
    let finalUri = img;
    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
        const base = __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_URL"] ? __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_URL"].replace(/\/api\/v1\/?$/, '') : '';
        // If the backend didn't include 'uploads/', we inject it.
        let path = img.startsWith('/') ? img : '/' + img;
        if (!path.startsWith('/uploads/')) {
            path = '/uploads' + path;
        }
        finalUri = `${base}${path}`;
    }
    return finalUri;
};
function ComplaintDetailsPage() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const isPrivileged = user?.role === "INSPECTOR" || user?.role === "WORKER" || user?.role === "SUPER_ADMIN" || user?.role === "DISTRICT_ADMIN";
    const isInspectorOrWorker = user?.role === "INSPECTOR" || user?.role === "WORKER";
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const id = params.id;
    const { data, isLoading: loading, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$hooks$2f$use$2d$complaints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComplaint"])(id);
    const complaint = data;
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (complaint) {
            console.log("--- DEBUG LOGS ---");
            console.log("Complaint Response:", complaint);
            console.log("complaint.images:", complaint.images);
            console.log("complaint.image_urls:", complaint.image_urls);
            console.log("complaint.proof_images:", complaint.proof_images);
        }
    }, [
        complaint
    ]);
    const [updating, setUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNotesModal, setShowNotesModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRejectModal, setShowRejectModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showResolveModal, setShowResolveModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newNote, setNewNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedProofImages, setSelectedProofImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedImagePreview, setSelectedImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [feedback, setFeedback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [reopenReason, setReopenReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [rejectReason, setRejectReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const updateStatus = async (newStatus)=>{
        try {
            setUpdating(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintsApi"].updateStatus(id, newStatus);
            refetch();
        } catch (e) {
            console.error(e);
            alert("Failed to update status");
        } finally{
            setUpdating(false);
        }
    };
    const handleAccept = async ()=>{
        try {
            setUpdating(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].inspectorStartWork(id);
            refetch();
            queryClient.invalidateQueries({
                queryKey: [
                    "ward-complaints"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "complaints"
                ]
            });
        } catch (e) {
            console.error(e);
            alert("Failed to accept complaint");
        } finally{
            setUpdating(false);
        }
    };
    const handleSubmitFeedback = async ()=>{
        if (rating === 0) return alert("Please select a rating");
        try {
            setUpdating(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintsApi"].submitFeedback(id, {
                rating,
                feedback
            });
            alert("Feedback submitted successfully!");
            refetch();
        } catch (e) {
            alert("Failed to submit feedback");
        } finally{
            setUpdating(false);
        }
    };
    const handleReopen = async ()=>{
        if (!reopenReason.trim()) return alert("Please provide a reason to reopen");
        try {
            setUpdating(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintsApi"].reopenComplaint(id, reopenReason);
            alert("Complaint reopened successfully!");
            refetch();
        } catch (e) {
            alert("Failed to reopen complaint");
        } finally{
            setUpdating(false);
        }
    };
    const handleRejectConfirm = async ()=>{
        if (!rejectReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        try {
            setUpdating(true);
            // Call existing Reject API
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].inspectorRejectComplaint(id);
            // Save the rejection reason via Notes API
            try {
                const { default: api } = await __turbopack_context__.A("[project]/civifix-web/src/lib/api.ts [app-ssr] (ecmascript, async loader)");
                await api.post(`/inspector/complaints/${id}/notes`, {
                    note: `Rejection Reason: ${rejectReason}`
                });
            } catch (noteErr) {
                console.error("Failed to save rejection reason", noteErr);
            }
            setShowRejectModal(false);
            refetch();
            queryClient.invalidateQueries({
                queryKey: [
                    "ward-complaints"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "complaints"
                ]
            });
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || "Failed to reject complaint";
            alert(msg);
        } finally{
            setUpdating(false);
        }
    };
    const handleResolveConfirm = async ()=>{
        try {
            setUpdating(true);
            if (selectedProofImages.length > 0) {
                const formData = new FormData();
                selectedProofImages.forEach((file)=>{
                    formData.append("images", file);
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintsApi"].resolveComplaintWithImages(id, formData);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].inspectorResolveComplaint(id);
            }
            setShowResolveModal(false);
            refetch();
            queryClient.invalidateQueries({
                queryKey: [
                    "ward-complaints"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "complaints"
                ]
            });
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || e.message || "Failed to resolve complaint";
            alert(msg);
        } finally{
            setUpdating(false);
        }
    };
    const addNote = async ()=>{
        try {
            setUpdating(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["complaintsApi"].addNote(id, {
                text: newNote
            });
            setNewNote("");
            setShowNotesModal(false);
            refetch();
        } catch (e) {
            console.error(e);
            alert("Failed to add note");
        } finally{
            setUpdating(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 bg-background flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-bold text-muted-foreground",
                        children: "Loading details..."
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
            lineNumber: 286,
            columnNumber: 7
        }, this);
    }
    if (!complaint) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 bg-background flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "w-16 h-16 text-destructive mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-black text-foreground mb-2",
                        children: "Complaint Not Found"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "text-primary font-bold hover:underline",
                        children: "Go Back"
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 298,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
            lineNumber: 297,
            columnNumber: 7
        }, this);
    }
    const typeMeta = TYPE_META[complaint.complaint_type] || TYPE_META.OTHER;
    const statusCfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.PENDING;
    const priorityCfg = PRIORITY_CONFIG[complaint.priority] || PRIORITY_CONFIG.MEDIUM;
    const StatusIcon = statusCfg.icon;
    const TypeIcon = typeMeta.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 bg-background min-h-screen pb-20 md:pb-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${isInspectorOrWorker ? "bg-gradient-to-br from-teal-800 to-teal-600" : "bg-primary"} pt-10 pb-16 px-6 md:px-12 md:rounded-b-[60px] rounded-b-[40px] shadow-lg flex items-start justify-between`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-3xl mx-auto w-full flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.back(),
                                    className: "w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors shadow-sm mt-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-6 h-6 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl md:text-3xl font-black text-white tracking-tight",
                                            children: "Complaint Details"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 330,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/80 font-bold text-sm mt-1 bg-white/10 px-3 py-1 rounded-full inline-block",
                                            children: complaint.complaint_id
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 331,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                            lineNumber: 322,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-4 h-4 rounded-full ${statusCfg.bg} border-[3px] border-white/50 shadow-sm mt-3`
                        }, void 0, false, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                    lineNumber: 321,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `bg-card rounded-[2rem] p-6 shadow-md mb-6 border-t-[6px] ${statusCfg.border.replace('border-', 'border-t-')}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-5 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-16 h-16 rounded-2xl ${typeMeta.bg} flex items-center justify-center shrink-0 border border-border/50`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                            className: `w-8 h-8 ${typeMeta.color}`
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 mt-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-black text-foreground tracking-tight leading-tight mb-2",
                                                children: complaint.title || typeMeta.title
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-muted-foreground tracking-widest",
                                                children: complaint.complaint_id
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-3 border-t border-border/50 pt-5 mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-2 px-4 py-2 rounded-xl border ${statusCfg.border} ${statusCfg.bg}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                                className: `w-5 h-5 ${statusCfg.color}`
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 356,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm font-bold ${statusCfg.color}`,
                                                children: statusCfg.label
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-2 px-4 py-2 rounded-xl border border-border ${priorityCfg.bg}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                className: `w-5 h-5 ${priorityCfg.color}`
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 360,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm font-bold ${priorityCfg.color}`,
                                                children: [
                                                    priorityCfg.label,
                                                    " Priority"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 361,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-auto text-sm font-bold text-muted-foreground flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 15
                                            }, this),
                                            new Date(complaint.created_at).toLocaleDateString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mb-8 pb-4 border-b border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                            className: "w-5 h-5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 374,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-black text-foreground",
                                        children: "Complaint Info"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                                label: "Description",
                                value: complaint.description
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
                                label: "Address",
                                value: complaint.address
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this),
                            complaint.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
                                label: "Landmark / Door No.",
                                value: complaint.landmark
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 382,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$navigation$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"],
                                label: "Coordinates",
                                value: complaint.latitude && complaint.longitude ? `${complaint.latitude}, ${complaint.longitude}` : null
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            (()=>{
                                let complaintImages = [];
                                if (Array.isArray(complaint.images) && complaint.images.length > 0) {
                                    complaintImages = complaint.images;
                                } else if (Array.isArray(complaint.image_urls) && complaint.image_urls.length > 0) {
                                    complaintImages = complaint.image_urls;
                                } else if (Array.isArray(complaint.proof_images) && complaint.proof_images.length > 0) {
                                    complaintImages = complaint.proof_images;
                                }
                                if (complaintImages.length > 0) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-8 pt-6 border-t border-border/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4",
                                                children: "Attached Photos"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                                children: complaintImages.map((url, index)=>{
                                                    const finalUrl = getFinalImageUri(url);
                                                    console.log(`[Web] Rendering Image: ${url} -> ${finalUrl}`);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative aspect-square rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer group",
                                                        onClick: ()=>setSelectedImagePreview(finalUrl),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: finalUrl,
                                                            alt: `Complaint ${index + 1}`,
                                                            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                            lineNumber: 414,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, index, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 404,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 17
                                    }, this);
                                }
                                return null;
                            })(),
                            (complaint.citizen_note || complaint.worker_note || complaint.inspector_note || complaint.rejection_reason) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-px bg-border my-8"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-6 pb-4 border-b border-border/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "w-5 h-5 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 430,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 429,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-black text-foreground",
                                                children: "Notes"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 432,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 428,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NoteCard, {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                                        label: "Citizen Note",
                                        value: complaint.citizen_note,
                                        colorClass: "text-primary",
                                        borderClass: "border-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 435,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NoteCard, {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hard$2d$hat$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HardHat$3e$__["HardHat"],
                                        label: "Worker Note",
                                        value: complaint.worker_note,
                                        colorClass: "text-secondary",
                                        borderClass: "border-secondary"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NoteCard, {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
                                        label: "Inspector Note",
                                        value: complaint.inspector_note,
                                        colorClass: "text-accent",
                                        borderClass: "border-accent"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 449,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NoteCard, {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
                                        label: "Rejection Reason",
                                        value: complaint.rejection_reason,
                                        colorClass: "text-destructive",
                                        borderClass: "border-destructive"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    isPrivileged && complaint.citizen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mb-8 pb-4 border-b border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            className: "w-5 h-5 text-success"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 472,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-black text-foreground",
                                        children: "Citizen Information"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                                label: "Name",
                                value: complaint.citizen.name
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
                                label: "Phone",
                                value: complaint.citizen.phone
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 477,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoRow, {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
                                label: "Email",
                                value: complaint.citizen.email
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 478,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this),
                    isPrivileged && complaint.history && complaint.history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mb-8 pb-4 border-b border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                            className: "w-5 h-5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 487,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-black text-foreground",
                                        children: "Activity Timeline"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 489,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 485,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative pl-8 border-l-2 border-border ml-5 pb-4 mt-4",
                                children: complaint.history.map((h, i)=>{
                                    const s = STATUS_CONFIG[h.status] || STATUS_CONFIG.PENDING;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-8 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute -left-[41px] w-5 h-5 rounded-full border-[4px] border-card ${s.bg.replace('bg-', 'bg-').replace('10', '500')} shadow-sm`
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-black text-foreground",
                                                children: s.label
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 497,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-muted-foreground mt-1",
                                                children: new Date(h.timestamp || h.created_at).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 498,
                                                columnNumber: 21
                                            }, this),
                                            h.remarks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-muted-foreground mt-3 bg-muted/30 p-4 rounded-2xl border border-border/50",
                                                children: h.remarks
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 502,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 495,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this),
                            complaint.notes && complaint.notes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 pt-6 border-t border-border/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-sm font-bold text-foreground mb-4",
                                        children: "Inspector Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 510,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: complaint.notes.map((note, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-amber-50 border border-amber-100 rounded-2xl p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium text-amber-900",
                                                        children: note.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-bold text-amber-700/60 mt-2",
                                                        children: [
                                                            new Date(note.created_at).toLocaleString(),
                                                            " • ",
                                                            note.role
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 513,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 511,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 509,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 484,
                        columnNumber: 11
                    }, this),
                    user?.role === "INSPECTOR" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            complaint.status === "OPEN" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-6 pb-4 border-b border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                    className: "w-5 h-5 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 533,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-black text-slate-800",
                                                children: "Complaint Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 536,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: updating,
                                                onClick: handleAccept,
                                                className: "flex items-center justify-center gap-2 bg-[#059669] hover:bg-emerald-700 text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all hover:-translate-y-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Accept"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 539,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: updating,
                                                onClick: ()=>setShowRejectModal(true),
                                                className: "flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-red-500/20 disabled:opacity-50 transition-all hover:-translate-y-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Reject"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 546,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 538,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 531,
                                columnNumber: 15
                            }, this),
                            complaint.status === "IN_PROGRESS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-6 pb-4 border-b border-slate-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-5 h-5 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 561,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-black text-slate-800",
                                                children: "Complaint Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 564,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: updating,
                                        onClick: ()=>setShowResolveModal(true),
                                        className: "w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-4 text-sm font-bold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all hover:-translate-y-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 571,
                                                columnNumber: 19
                                            }, this),
                                            " Resolve Complaint"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 566,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 559,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    user?.role === "CITIZEN" && [
                        "CLOSED",
                        "RESOLVED"
                    ].includes(complaint.status) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-black text-slate-800 mb-4",
                                children: "Provide Feedback"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 581,
                                columnNumber: 13
                            }, this),
                            !complaint.feedback?.rating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mb-4",
                                        children: [
                                            1,
                                            2,
                                            3,
                                            4,
                                            5
                                        ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setRating(star),
                                                className: "focus:outline-none transition-transform hover:scale-110",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-8 h-8 ${rating >= star ? 'text-amber-500' : 'text-slate-300'}`,
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 588,
                                                    columnNumber: 23
                                                }, this)
                                            }, star, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 587,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 585,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: feedback,
                                        onChange: (e)=>setFeedback(e.target.value),
                                        placeholder: "Write your feedback...",
                                        className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500",
                                        rows: 3
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 594,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: updating,
                                        onClick: handleSubmitFeedback,
                                        className: "w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50",
                                        children: "Submit Feedback"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 601,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 584,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-bold text-amber-800",
                                        children: [
                                            "Feedback Submitted (",
                                            complaint.feedback.rating,
                                            "/5)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 611,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-amber-700 mt-1",
                                        children: complaint.feedback.comments
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 610,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-slate-100 pt-6 mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-black text-slate-800 mb-4",
                                        children: "Not Satisfied?"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 617,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: reopenReason,
                                        onChange: (e)=>setReopenReason(e.target.value),
                                        placeholder: "Reason for reopening...",
                                        className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500",
                                        rows: 3
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 618,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: updating,
                                        onClick: handleReopen,
                                        className: "w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50",
                                        children: "Reopen Complaint"
                                    }, void 0, false, {
                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                        lineNumber: 625,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 616,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 580,
                        columnNumber: 11
                    }, this),
                    showNotesModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-black text-foreground mb-6",
                                    children: "Add Note"
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: newNote,
                                    onChange: (e)=>setNewNote(e.target.value),
                                    className: "w-full h-32 bg-muted/30 border-2 border-border rounded-2xl p-5 text-sm font-medium text-foreground mb-6 focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none",
                                    placeholder: "Type your observations..."
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 641,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowNotesModal(false),
                                            className: "flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            disabled: updating || !newNote,
                                            onClick: addNote,
                                            className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl shadow-md shadow-primary/20 disabled:opacity-50 transition-colors",
                                            children: "Save Note"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 647,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                            lineNumber: 639,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 638,
                        columnNumber: 11
                    }, this),
                    showRejectModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                className: "w-6 h-6 text-destructive"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 660,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-black text-foreground",
                                            children: "Reject Complaint"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 663,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 659,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-muted-foreground leading-relaxed mb-4",
                                    children: "Please provide a detailed reason for rejecting this complaint. This will be visible to the citizen."
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 665,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                            children: "Reason (Required)"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 670,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: rejectReason,
                                            onChange: (e)=>setRejectReason(e.target.value),
                                            placeholder: "E.g., Issue not found at location, duplicate complaint...",
                                            className: "w-full bg-muted/20 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 671,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 669,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            disabled: updating,
                                            onClick: ()=>setShowRejectModal(false),
                                            className: "flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl disabled:opacity-50 transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 680,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            disabled: updating || !rejectReason.trim(),
                                            onClick: handleRejectConfirm,
                                            className: "flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-red-500/20 disabled:opacity-50 transition-colors",
                                            children: "Reject"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 687,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 679,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                            lineNumber: 658,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 657,
                        columnNumber: 11
                    }, this),
                    showResolveModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-border animate-in fade-in zoom-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-6 h-6 text-success"
                                            }, void 0, false, {
                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 704,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-black text-foreground",
                                            children: "Mark Resolved"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 707,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 703,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-muted-foreground leading-relaxed mb-6",
                                    children: "Have you verified that the issue has been successfully resolved?"
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 709,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-bold text-muted-foreground tracking-wider mb-2 uppercase",
                                            children: "Proof Images (Required)"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 714,
                                            columnNumber: 17
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
                                                            setSelectedProofImages([
                                                                ...selectedProofImages,
                                                                ...Array.from(e.target.files)
                                                            ]);
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 716,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "w-5 h-5 text-success"
                                                    }, void 0, false, {
                                                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                        lineNumber: 728,
                                                        columnNumber: 22
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-bold text-foreground",
                                                    children: "Tap or drag images here"
                                                }, void 0, false, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 730,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 715,
                                            columnNumber: 17
                                        }, this),
                                        selectedProofImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mt-4",
                                            children: selectedProofImages.map((file, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative w-16 h-16 rounded-xl overflow-hidden border border-border group shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: URL.createObjectURL(file),
                                                            alt: "Preview",
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setSelectedProofImages(selectedProofImages.filter((_, index)=>index !== i));
                                                            },
                                                            className: "absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                                lineNumber: 747,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                            lineNumber: 738,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                                    lineNumber: 736,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 734,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 713,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            disabled: updating,
                                            onClick: ()=>setShowResolveModal(false),
                                            className: "flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3.5 rounded-2xl disabled:opacity-50 transition-colors",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            disabled: updating,
                                            onClick: handleResolveConfirm,
                                            className: "flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-teal-600/20 disabled:opacity-50 transition-colors",
                                            children: "Confirm"
                                        }, void 0, false, {
                                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                            lineNumber: 763,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 755,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                            lineNumber: 702,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 701,
                        columnNumber: 11
                    }, this),
                    selectedImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center",
                        onClick: ()=>setSelectedImagePreview(null),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                    lineNumber: 779,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 778,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$civifix$2d$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: selectedImagePreview,
                                alt: "Fullscreen Preview",
                                className: "max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
                            }, void 0, false, {
                                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                                lineNumber: 781,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                        lineNumber: 777,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/civifix-web/src/app/(dashboard)/complaints/[id]/page.tsx",
        lineNumber: 317,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=civifix-web_src_5b835f01._.js.map