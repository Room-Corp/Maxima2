// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmux_2to1.h for the primary calling header

#include "Vmux_2to1__pch.h"
#include "Vmux_2to1___024root.h"

VL_ATTR_COLD void Vmux_2to1___024root___eval_static__TOP(Vmux_2to1___024root* vlSelf);

VL_ATTR_COLD void Vmux_2to1___024root___eval_static(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_static\n"); );
    // Body
    Vmux_2to1___024root___eval_static__TOP(vlSelf);
}

VL_ATTR_COLD void Vmux_2to1___024root___eval_static__TOP(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_static__TOP\n"); );
    // Body
    vlSelf->mux_2to1_tb__DOT__clk = 0U;
}

VL_ATTR_COLD void Vmux_2to1___024root___eval_final(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_final\n"); );
}

VL_ATTR_COLD void Vmux_2to1___024root___eval_settle(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___eval_settle\n"); );
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmux_2to1___024root___dump_triggers__act(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___dump_triggers__act\n"); );
    // Body
    if ((1U & (~ vlSelf->__VactTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 0 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
}
#endif  // VL_DEBUG

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmux_2to1___024root___dump_triggers__nba(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___dump_triggers__nba\n"); );
    // Body
    if ((1U & (~ vlSelf->__VnbaTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelf->__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 0 is active: @([true] __VdlySched.awaitingCurrentTime())\n");
    }
}
#endif  // VL_DEBUG

VL_ATTR_COLD void Vmux_2to1___024root___ctor_var_reset(Vmux_2to1___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root___ctor_var_reset\n"); );
    // Body
    vlSelf->mux_2to1_tb__DOT__a = VL_RAND_RESET_I(1);
    vlSelf->mux_2to1_tb__DOT__b = VL_RAND_RESET_I(1);
    vlSelf->mux_2to1_tb__DOT__sel = VL_RAND_RESET_I(1);
    vlSelf->mux_2to1_tb__DOT__clk = VL_RAND_RESET_I(1);
    vlSelf->__Vdlyvval__mux_2to1_tb__DOT__clk__v0 = VL_RAND_RESET_I(1);
    vlSelf->__Vdlyvset__mux_2to1_tb__DOT__clk__v0 = 0;
}
