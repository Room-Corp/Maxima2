// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vsimple_testbench.h for the primary calling header

#include "Vsimple_testbench__pch.h"
#include "Vsimple_testbench___024root.h"

VL_ATTR_COLD void Vsimple_testbench___024root___eval_static(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___eval_static\n"); );
}

VL_ATTR_COLD void Vsimple_testbench___024root___eval_final(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___eval_final\n"); );
}

VL_ATTR_COLD void Vsimple_testbench___024root___eval_settle(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___eval_settle\n"); );
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vsimple_testbench___024root___dump_triggers__act(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___dump_triggers__act\n"); );
    // Body
    if ((1U & (~ vlSelf->__VactTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 0 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
    if ((2ULL & vlSelf->__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 1 is active: @(posedge simple_testbench.clk)\n");
    }
}
#endif  // VL_DEBUG

#ifdef VL_DEBUG
VL_ATTR_COLD void Vsimple_testbench___024root___dump_triggers__nba(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___dump_triggers__nba\n"); );
    // Body
    if ((1U & (~ vlSelf->__VnbaTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 0 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
    if ((2ULL & vlSelf->__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 1 is active: @(posedge simple_testbench.clk)\n");
    }
}
#endif  // VL_DEBUG

VL_ATTR_COLD void Vsimple_testbench___024root___ctor_var_reset(Vsimple_testbench___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vsimple_testbench__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vsimple_testbench___024root___ctor_var_reset\n"); );
    // Body
    vlSelf->simple_testbench__DOT__clk = VL_RAND_RESET_I(1);
    vlSelf->__Vtrigprevexpr___TOP__simple_testbench__DOT__clk__0 = VL_RAND_RESET_I(1);
}
