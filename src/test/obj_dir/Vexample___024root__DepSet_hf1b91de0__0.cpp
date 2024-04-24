// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vexample.h for the primary calling header

#include "Vexample__pch.h"
#include "Vexample___024root.h"

VlCoroutine Vexample___024root___eval_initial__TOP__Vtiming__0(Vexample___024root* vlSelf);
VlCoroutine Vexample___024root___eval_initial__TOP__Vtiming__1(Vexample___024root* vlSelf);

void Vexample___024root___eval_initial(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_initial\n"); );
    // Body
    vlSelf->__Vm_traceActivity[1U] = 1U;
    Vexample___024root___eval_initial__TOP__Vtiming__0(vlSelf);
    Vexample___024root___eval_initial__TOP__Vtiming__1(vlSelf);
    vlSelf->__Vtrigprevexpr___TOP__example_tb__DOT__clk_in__0 
        = vlSelf->example_tb__DOT__clk_in;
}

VL_INLINE_OPT VlCoroutine Vexample___024root___eval_initial__TOP__Vtiming__1(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_initial__TOP__Vtiming__1\n"); );
    // Body
    while (1U) {
        co_await vlSelf->__VdlySched.delay(0x1388ULL, 
                                           nullptr, 
                                           "example_tb.sv", 
                                           17);
        vlSelf->example_tb__DOT__clk_in = (1U & (~ (IData)(vlSelf->example_tb__DOT__clk_in)));
    }
}

void Vexample___024root___eval_act(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_act\n"); );
}

void Vexample___024root___nba_sequent__TOP__0(Vexample___024root* vlSelf);

void Vexample___024root___eval_nba(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_nba\n"); );
    // Body
    if ((1ULL & vlSelf->__VnbaTriggered.word(0U))) {
        Vexample___024root___nba_sequent__TOP__0(vlSelf);
    }
}

VL_INLINE_OPT void Vexample___024root___nba_sequent__TOP__0(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___nba_sequent__TOP__0\n"); );
    // Body
    vlSelf->example_tb__DOT__c_out = ((IData)(vlSelf->example_tb__DOT__rst_in)
                                       ? 0U : (0x1fU 
                                               & (((IData)(vlSelf->example_tb__DOT__a_in) 
                                                   > (IData)(vlSelf->example_tb__DOT__b_in))
                                                   ? (IData)(vlSelf->example_tb__DOT__c_out)
                                                   : 
                                                  ((IData)(1U) 
                                                   + (IData)(vlSelf->example_tb__DOT__c_out)))));
}

void Vexample___024root___timing_resume(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___timing_resume\n"); );
    // Body
    if ((2ULL & vlSelf->__VactTriggered.word(0U))) {
        vlSelf->__VdlySched.resume();
    }
}

void Vexample___024root___eval_triggers__act(Vexample___024root* vlSelf);

bool Vexample___024root___eval_phase__act(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_phase__act\n"); );
    // Init
    VlTriggerVec<2> __VpreTriggered;
    CData/*0:0*/ __VactExecute;
    // Body
    Vexample___024root___eval_triggers__act(vlSelf);
    __VactExecute = vlSelf->__VactTriggered.any();
    if (__VactExecute) {
        __VpreTriggered.andNot(vlSelf->__VactTriggered, vlSelf->__VnbaTriggered);
        vlSelf->__VnbaTriggered.thisOr(vlSelf->__VactTriggered);
        Vexample___024root___timing_resume(vlSelf);
        Vexample___024root___eval_act(vlSelf);
    }
    return (__VactExecute);
}

bool Vexample___024root___eval_phase__nba(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_phase__nba\n"); );
    // Init
    CData/*0:0*/ __VnbaExecute;
    // Body
    __VnbaExecute = vlSelf->__VnbaTriggered.any();
    if (__VnbaExecute) {
        Vexample___024root___eval_nba(vlSelf);
        vlSelf->__VnbaTriggered.clear();
    }
    return (__VnbaExecute);
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vexample___024root___dump_triggers__nba(Vexample___024root* vlSelf);
#endif  // VL_DEBUG
#ifdef VL_DEBUG
VL_ATTR_COLD void Vexample___024root___dump_triggers__act(Vexample___024root* vlSelf);
#endif  // VL_DEBUG

void Vexample___024root___eval(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval\n"); );
    // Init
    IData/*31:0*/ __VnbaIterCount;
    CData/*0:0*/ __VnbaContinue;
    // Body
    __VnbaIterCount = 0U;
    __VnbaContinue = 1U;
    while (__VnbaContinue) {
        if (VL_UNLIKELY((0x64U < __VnbaIterCount))) {
#ifdef VL_DEBUG
            Vexample___024root___dump_triggers__nba(vlSelf);
#endif
            VL_FATAL_MT("example_tb.sv", 3, "", "NBA region did not converge.");
        }
        __VnbaIterCount = ((IData)(1U) + __VnbaIterCount);
        __VnbaContinue = 0U;
        vlSelf->__VactIterCount = 0U;
        vlSelf->__VactContinue = 1U;
        while (vlSelf->__VactContinue) {
            if (VL_UNLIKELY((0x64U < vlSelf->__VactIterCount))) {
#ifdef VL_DEBUG
                Vexample___024root___dump_triggers__act(vlSelf);
#endif
                VL_FATAL_MT("example_tb.sv", 3, "", "Active region did not converge.");
            }
            vlSelf->__VactIterCount = ((IData)(1U) 
                                       + vlSelf->__VactIterCount);
            vlSelf->__VactContinue = 0U;
            if (Vexample___024root___eval_phase__act(vlSelf)) {
                vlSelf->__VactContinue = 1U;
            }
        }
        if (Vexample___024root___eval_phase__nba(vlSelf)) {
            __VnbaContinue = 1U;
        }
    }
}

#ifdef VL_DEBUG
void Vexample___024root___eval_debug_assertions(Vexample___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root___eval_debug_assertions\n"); );
}
#endif  // VL_DEBUG
