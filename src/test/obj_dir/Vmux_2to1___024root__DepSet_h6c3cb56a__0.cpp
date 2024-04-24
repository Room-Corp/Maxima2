// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmux_2to1.h for the primary calling header

#include "Vmux_2to1__pch.h"
#include "Vmux_2to1__Syms.h"
#include "Vmux_2to1___024root.h"

VL_INLINE_OPT VlCoroutine Vmux_2to1___024root___eval_initial__TOP__Vtiming__0(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_initial__TOP__Vtiming__0\n"); );
    // Init
    VlWide<3>/*95:0*/ __Vtemp_1;
    // Body
    __Vtemp_1[0U] = 0x2e766364U;
    __Vtemp_1[1U] = 0x6e646f6dU;
    __Vtemp_1[2U] = 0x7261U;
    vlSymsp->_vm_contextp__->dumpfile(VL_CVT_PACK_STR_NW(3, __Vtemp_1));
    vlSymsp->_traceDumpOpen();
    vlSelf->mux_2to1_tb__DOT__a = 1U;
    vlSelf->mux_2to1_tb__DOT__b = 0U;
    vlSelf->mux_2to1_tb__DOT__sel = 0U;
    co_await vlSelf->__VdlySched.delay(0x14ULL, nullptr, 
                                       "mux_2to1_tb.v", 
                                       29);
    vlSelf->mux_2to1_tb__DOT__a = 1U;
    vlSelf->mux_2to1_tb__DOT__b = 0U;
    vlSelf->mux_2to1_tb__DOT__sel = 1U;
    co_await vlSelf->__VdlySched.delay(0x14ULL, nullptr, 
                                       "mux_2to1_tb.v", 
                                       32);
    vlSelf->mux_2to1_tb__DOT__a = 0U;
    vlSelf->mux_2to1_tb__DOT__b = 1U;
    vlSelf->mux_2to1_tb__DOT__sel = 0U;
    co_await vlSelf->__VdlySched.delay(0x14ULL, nullptr, 
                                       "mux_2to1_tb.v", 
                                       35);
    vlSelf->mux_2to1_tb__DOT__a = 0U;
    vlSelf->mux_2to1_tb__DOT__b = 1U;
    vlSelf->mux_2to1_tb__DOT__sel = 1U;
    co_await vlSelf->__VdlySched.delay(0x14ULL, nullptr, 
                                       "mux_2to1_tb.v", 
                                       38);
    VL_FINISH_MT("mux_2to1_tb.v", 40, "");
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmux_2to1___024root___dump_triggers__act(Vmux_2to1___024root* vlSelf);
#endif  // VL_DEBUG

void Vmux_2to1___024root___eval_triggers__act(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_triggers__act\n"); );
    // Body
    vlSelf->__VactTriggered.set(0U, vlSelf->__VdlySched.awaitingCurrentTime());
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vmux_2to1___024root___dump_triggers__act(vlSelf);
    }
#endif
}
