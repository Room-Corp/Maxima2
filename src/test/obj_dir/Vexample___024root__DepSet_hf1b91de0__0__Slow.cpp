// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vexample.h for the primary calling header

#include "Vexample__pch.h"
#include "Vexample___024root.h"

VL_ATTR_COLD void Vexample___024root___eval_static(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_static\n"); );
}

VL_ATTR_COLD void Vexample___024root___eval_final(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_final\n"); );
}

VL_ATTR_COLD void Vexample___024root___eval_settle(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_settle\n"); );
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vexample___024root___dump_triggers__act(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___dump_triggers__act\n"); );
    // Body
    if ((1U & (~ vlSelf->__VactTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 0 is active: @(posedge example_tb.clk_in)\n");
    }
    if ((2ULL & vlSelf->__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 1 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
}
#endif  // VL_DEBUG

#ifdef VL_DEBUG
VL_ATTR_COLD void Vexample___024root___dump_triggers__nba(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___dump_triggers__nba\n"); );
    // Body
    if ((1U & (~ vlSelf->__VnbaTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 0 is active: @(posedge example_tb.clk_in)\n");
    }
    if ((2ULL & vlSelf->__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 1 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
}
#endif  // VL_DEBUG

VL_ATTR_COLD void Vexample___024root___ctor_var_reset(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___ctor_var_reset\n"); );
    // Body
    vlSelf->example_tb__DOT__clk_in = VL_RAND_RESET_I(1);
    vlSelf->example_tb__DOT__rst_in = VL_RAND_RESET_I(1);
    vlSelf->example_tb__DOT__a_in = VL_RAND_RESET_I(6);
    vlSelf->example_tb__DOT__b_in = VL_RAND_RESET_I(6);
    vlSelf->example_tb__DOT__c_out = VL_RAND_RESET_I(5);
    vlSelf->example_tb__DOT__unnamedblk1__DOT__i = VL_RAND_RESET_I(32);
    vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j = VL_RAND_RESET_I(32);
    vlSelf->__Vtrigprevexpr___TOP__example_tb__DOT__clk_in__0 = VL_RAND_RESET_I(1);
    for (int __Vi0 = 0; __Vi0 < 3; ++__Vi0) {
        vlSelf->__Vm_traceActivity[__Vi0] = 0;
    }
}
