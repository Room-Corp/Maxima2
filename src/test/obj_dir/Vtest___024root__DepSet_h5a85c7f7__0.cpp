// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vtest.h for the primary calling header

#include "Vtest__pch.h"
#include "Vtest__Syms.h"
#include "Vtest___024root.h"

#ifdef VL_DEBUG
VL_ATTR_COLD void Vtest___024root___dump_triggers__act(Vtest___024root* vlSelf);
#endif  // VL_DEBUG

void Vtest___024root___eval_triggers__act(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_triggers__act\n"); );
    // Body
    vlSelf->__VactTriggered.set(0U, ((IData)(vlSelf->centerLight_testbench__DOT__clk) 
                                     & (~ (IData)(vlSelf->__Vtrigprevexpr___TOP__centerLight_testbench__DOT__clk__0))));
    vlSelf->__VactTriggered.set(1U, vlSelf->__VdlySched.awaitingCurrentTime());
    vlSelf->__Vtrigprevexpr___TOP__centerLight_testbench__DOT__clk__0 
        = vlSelf->centerLight_testbench__DOT__clk;
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vtest___024root___dump_triggers__act(vlSelf);
    }
#endif
}
