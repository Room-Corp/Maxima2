// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vsimple_testbench.h for the primary calling header

#include "Vsimple_testbench__pch.h"
#include "Vsimple_testbench__Syms.h"
#include "Vsimple_testbench___024root.h"

VL_INLINE_OPT VlCoroutine Vsimple_testbench___024root___eval_initial__TOP__Vtiming__0(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___eval_initial__TOP__Vtiming__0\n"); );
    // Init
    VlWide<3>/*95:0*/ __Vtemp_1;
    // Body
    __Vtemp_1[0U] = 0x2e766364U;
    __Vtemp_1[1U] = 0x6d706c65U;
    __Vtemp_1[2U] = 0x7369U;
    vlSymsp->_vm_contextp__->dumpfile(VL_CVT_PACK_STR_NW(3, __Vtemp_1));
    VL_PRINTF_MT("-Info: simple_testbench.sv:13: $dumpvar ignored, as Verilated without --trace\n");
    vlSelf->simple_testbench__DOT__clk = 0U;
    while (1U) {
        co_await vlSelf->__VdlySched.delay(0xc350ULL, 
                                           nullptr, 
                                           "simple_testbench.sv", 
                                           15);
        vlSelf->simple_testbench__DOT__clk = (1U & 
                                              (~ (IData)(vlSelf->simple_testbench__DOT__clk)));
    }
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vsimple_testbench___024root___dump_triggers__act(Vsimple_testbench___024root* vlSelf);
#endif  // VL_DEBUG

void Vsimple_testbench___024root___eval_triggers__act(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___eval_triggers__act\n"); );
    // Body
    vlSelf->__VactTriggered.set(0U, vlSelf->__VdlySched.awaitingCurrentTime());
    vlSelf->__VactTriggered.set(1U, ((IData)(vlSelf->simple_testbench__DOT__clk) 
                                     & (~ (IData)(vlSelf->__Vtrigprevexpr___TOP__simple_testbench__DOT__clk__0))));
    vlSelf->__Vtrigprevexpr___TOP__simple_testbench__DOT__clk__0 
        = vlSelf->simple_testbench__DOT__clk;
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vsimple_testbench___024root___dump_triggers__act(vlSelf);
    }
#endif
}
