// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vcounter.h for the primary calling header

#include "Vcounter__pch.h"
#include "Vcounter__Syms.h"
#include "Vcounter___024root.h"

VL_INLINE_OPT VlCoroutine Vcounter___024root___eval_initial__TOP__Vtiming__0(Vcounter___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vcounter__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vcounter___024root___eval_initial__TOP__Vtiming__0\n"); );
    // Init
    VlWide<3>/*95:0*/ __Vtemp_1;
    // Body
    __Vtemp_1[0U] = 0x2e766364U;
    __Vtemp_1[1U] = 0x6e646f6dU;
    __Vtemp_1[2U] = 0x7261U;
    vlSymsp->_vm_contextp__->dumpfile(VL_CVT_PACK_STR_NW(3, __Vtemp_1));
    vlSymsp->_traceDumpOpen();
    co_await vlSelf->__VdlySched.delay(0x50ULL, nullptr, 
                                       "tb.v", 8);
    vlSelf->tb__DOT__rstn = 1U;
    co_await vlSelf->__VdlySched.delay(0x140ULL, nullptr, 
                                       "tb.v", 9);
    VL_FINISH_MT("tb.v", 9, "");
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vcounter___024root___dump_triggers__act(Vcounter___024root* vlSelf);
#endif  // VL_DEBUG

void Vcounter___024root___eval_triggers__act(Vcounter___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vcounter__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vcounter___024root___eval_triggers__act\n"); );
    // Body
    vlSelf->__VactTriggered.set(0U, (((IData)(vlSelf->tb__DOT__clk) 
                                      & (~ (IData)(vlSelf->__Vtrigprevexpr___TOP__tb__DOT__clk__0))) 
                                     | ((~ (IData)(vlSelf->tb__DOT__rstn)) 
                                        & (IData)(vlSelf->__Vtrigprevexpr___TOP__tb__DOT__rstn__0))));
    vlSelf->__VactTriggered.set(1U, vlSelf->__VdlySched.awaitingCurrentTime());
    vlSelf->__Vtrigprevexpr___TOP__tb__DOT__clk__0 
        = vlSelf->tb__DOT__clk;
    vlSelf->__Vtrigprevexpr___TOP__tb__DOT__rstn__0 
        = vlSelf->tb__DOT__rstn;
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vcounter___024root___dump_triggers__act(vlSelf);
    }
#endif
}
