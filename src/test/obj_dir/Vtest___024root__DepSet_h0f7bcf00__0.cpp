// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vtest.h for the primary calling header

#include "Vtest__pch.h"
#include "Vtest___024root.h"

VlCoroutine Vtest___024root___eval_initial__TOP__Vtiming__0(Vtest___024root* vlSelf);
VlCoroutine Vtest___024root___eval_initial__TOP__Vtiming__1(Vtest___024root* vlSelf);

void Vtest___024root___eval_initial(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_initial\n"); );
    // Body
    vlSelf->__Vm_traceActivity[1U] = 1U;
    Vtest___024root___eval_initial__TOP__Vtiming__0(vlSelf);
    Vtest___024root___eval_initial__TOP__Vtiming__1(vlSelf);
    vlSelf->__Vtrigprevexpr___TOP__centerLight_testbench__DOT__clk__0 
        = vlSelf->centerLight_testbench__DOT__clk;
}

VL_INLINE_OPT VlCoroutine Vtest___024root___eval_initial__TOP__Vtiming__0(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_initial__TOP__Vtiming__0\n"); );
    // Body
    vlSelf->centerLight_testbench__DOT__clk = 0U;
    while (1U) {
        co_await vlSelf->__VdlySched.delay(0x32ULL, 
                                           nullptr, 
                                           "test.sv", 
                                           58);
        vlSelf->centerLight_testbench__DOT__clk = (1U 
                                                   & (~ (IData)(vlSelf->centerLight_testbench__DOT__clk)));
    }
}

VL_INLINE_OPT VlCoroutine Vtest___024root___eval_initial__TOP__Vtiming__1(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_initial__TOP__Vtiming__1\n"); );
    // Body
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       64);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__reset = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       65);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       66);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__reset = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       67);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       68);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 1U;
    vlSelf->centerLight_testbench__DOT__R = 0U;
    vlSelf->centerLight_testbench__DOT__NL = 0U;
    vlSelf->centerLight_testbench__DOT__NR = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       69);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       70);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       71);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       72);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__NL = 1U;
    vlSelf->centerLight_testbench__DOT__NR = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       73);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       74);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       75);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       76);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 0U;
    vlSelf->centerLight_testbench__DOT__R = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       77);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       78);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       79);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       80);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__NL = 0U;
    vlSelf->centerLight_testbench__DOT__NR = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       81);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       82);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       83);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       84);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 1U;
    vlSelf->centerLight_testbench__DOT__NL = 1U;
    vlSelf->centerLight_testbench__DOT__NR = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       85);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       86);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       87);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       88);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__reset = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       89);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       90);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       91);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 0U;
    vlSelf->centerLight_testbench__DOT__R = 1U;
    vlSelf->centerLight_testbench__DOT__NL = 1U;
    vlSelf->centerLight_testbench__DOT__NR = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       92);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       93);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       94);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 1U;
    vlSelf->centerLight_testbench__DOT__R = 0U;
    vlSelf->centerLight_testbench__DOT__NL = 0U;
    vlSelf->centerLight_testbench__DOT__NR = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       95);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       96);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       97);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    vlSelf->centerLight_testbench__DOT__L = 0U;
    vlSelf->centerLight_testbench__DOT__R = 1U;
    vlSelf->centerLight_testbench__DOT__NL = 0U;
    vlSelf->centerLight_testbench__DOT__NR = 0U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       98);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       99);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    co_await vlSelf->__VtrigSched_hd2770c93__0.trigger(0U, 
                                                       nullptr, 
                                                       "@(posedge centerLight_testbench.clk)", 
                                                       "test.sv", 
                                                       100);
    vlSelf->__Vm_traceActivity[2U] = 1U;
    VL_STOP_MT("test.sv", 101, "");
    vlSelf->__Vm_traceActivity[2U] = 1U;
}

void Vtest___024root___act_sequent__TOP__0(Vtest___024root* vlSelf);

void Vtest___024root___eval_act(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_act\n"); );
    // Body
    if ((1ULL & vlSelf->__VactTriggered.word(0U))) {
        Vtest___024root___act_sequent__TOP__0(vlSelf);
    }
}

extern const VlUnpacked<CData/*0:0*/, 32> Vtest__ConstPool__TABLE_h1cdd5042_0;
extern const VlUnpacked<CData/*0:0*/, 32> Vtest__ConstPool__TABLE_h678b9a44_0;

VL_INLINE_OPT void Vtest___024root___act_sequent__TOP__0(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___act_sequent__TOP__0\n"); );
    // Init
    CData/*4:0*/ __Vtableidx1;
    __Vtableidx1 = 0;
    // Body
    __Vtableidx1 = (((IData)(vlSelf->centerLight_testbench__DOT__NR) 
                     << 4U) | (((IData)(vlSelf->centerLight_testbench__DOT__NL) 
                                << 3U) | (((IData)(vlSelf->centerLight_testbench__DOT__L) 
                                           << 2U) | 
                                          (((IData)(vlSelf->centerLight_testbench__DOT__R) 
                                            << 1U) 
                                           | (IData)(vlSelf->centerLight_testbench__DOT__dut__DOT__ps)))));
    vlSelf->centerLight_testbench__DOT__dut__DOT__ns 
        = Vtest__ConstPool__TABLE_h1cdd5042_0[__Vtableidx1];
    vlSelf->centerLight_testbench__DOT__lightOn = Vtest__ConstPool__TABLE_h678b9a44_0
        [__Vtableidx1];
}

void Vtest___024root___nba_sequent__TOP__0(Vtest___024root* vlSelf);

void Vtest___024root___eval_nba(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_nba\n"); );
    // Body
    if ((1ULL & vlSelf->__VnbaTriggered.word(0U))) {
        Vtest___024root___nba_sequent__TOP__0(vlSelf);
    }
}

VL_INLINE_OPT void Vtest___024root___nba_sequent__TOP__0(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___nba_sequent__TOP__0\n"); );
    // Init
    CData/*4:0*/ __Vtableidx1;
    __Vtableidx1 = 0;
    // Body
    vlSelf->centerLight_testbench__DOT__dut__DOT__ps 
        = (1U & (((IData)(vlSelf->centerLight_testbench__DOT__reset) 
                  | (~ (IData)(vlSelf->centerLight_testbench__DOT__done))) 
                 | (IData)(vlSelf->centerLight_testbench__DOT__dut__DOT__ns)));
    __Vtableidx1 = (((IData)(vlSelf->centerLight_testbench__DOT__NR) 
                     << 4U) | (((IData)(vlSelf->centerLight_testbench__DOT__NL) 
                                << 3U) | (((IData)(vlSelf->centerLight_testbench__DOT__L) 
                                           << 2U) | 
                                          (((IData)(vlSelf->centerLight_testbench__DOT__R) 
                                            << 1U) 
                                           | (IData)(vlSelf->centerLight_testbench__DOT__dut__DOT__ps)))));
    vlSelf->centerLight_testbench__DOT__dut__DOT__ns 
        = Vtest__ConstPool__TABLE_h1cdd5042_0[__Vtableidx1];
    vlSelf->centerLight_testbench__DOT__lightOn = Vtest__ConstPool__TABLE_h678b9a44_0
        [__Vtableidx1];
}

void Vtest___024root___timing_commit(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___timing_commit\n"); );
    // Body
    if ((! (1ULL & vlSelf->__VactTriggered.word(0U)))) {
        vlSelf->__VtrigSched_hd2770c93__0.commit("@(posedge centerLight_testbench.clk)");
    }
}

void Vtest___024root___timing_resume(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___timing_resume\n"); );
    // Body
    if ((1ULL & vlSelf->__VactTriggered.word(0U))) {
        vlSelf->__VtrigSched_hd2770c93__0.resume("@(posedge centerLight_testbench.clk)");
    }
    if ((2ULL & vlSelf->__VactTriggered.word(0U))) {
        vlSelf->__VdlySched.resume();
    }
}

void Vtest___024root___eval_triggers__act(Vtest___024root* vlSelf);

bool Vtest___024root___eval_phase__act(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_phase__act\n"); );
    // Init
    VlTriggerVec<2> __VpreTriggered;
    CData/*0:0*/ __VactExecute;
    // Body
    Vtest___024root___eval_triggers__act(vlSelf);
    Vtest___024root___timing_commit(vlSelf);
    __VactExecute = vlSelf->__VactTriggered.any();
    if (__VactExecute) {
        __VpreTriggered.andNot(vlSelf->__VactTriggered, vlSelf->__VnbaTriggered);
        vlSelf->__VnbaTriggered.thisOr(vlSelf->__VactTriggered);
        Vtest___024root___timing_resume(vlSelf);
        Vtest___024root___eval_act(vlSelf);
    }
    return (__VactExecute);
}

bool Vtest___024root___eval_phase__nba(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_phase__nba\n"); );
    // Init
    CData/*0:0*/ __VnbaExecute;
    // Body
    __VnbaExecute = vlSelf->__VnbaTriggered.any();
    if (__VnbaExecute) {
        Vtest___024root___eval_nba(vlSelf);
        vlSelf->__VnbaTriggered.clear();
    }
    return (__VnbaExecute);
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vtest___024root___dump_triggers__nba(Vtest___024root* vlSelf);
#endif  // VL_DEBUG
#ifdef VL_DEBUG
VL_ATTR_COLD void Vtest___024root___dump_triggers__act(Vtest___024root* vlSelf);
#endif  // VL_DEBUG

void Vtest___024root___eval(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval\n"); );
    // Init
    IData/*31:0*/ __VnbaIterCount;
    CData/*0:0*/ __VnbaContinue;
    // Body
    __VnbaIterCount = 0U;
    __VnbaContinue = 1U;
    while (__VnbaContinue) {
        if (VL_UNLIKELY((0x64U < __VnbaIterCount))) {
#ifdef VL_DEBUG
            Vtest___024root___dump_triggers__nba(vlSelf);
#endif
            VL_FATAL_MT("test.sv", 47, "", "NBA region did not converge.");
        }
        __VnbaIterCount = ((IData)(1U) + __VnbaIterCount);
        __VnbaContinue = 0U;
        vlSelf->__VactIterCount = 0U;
        vlSelf->__VactContinue = 1U;
        while (vlSelf->__VactContinue) {
            if (VL_UNLIKELY((0x64U < vlSelf->__VactIterCount))) {
#ifdef VL_DEBUG
                Vtest___024root___dump_triggers__act(vlSelf);
#endif
                VL_FATAL_MT("test.sv", 47, "", "Active region did not converge.");
            }
            vlSelf->__VactIterCount = ((IData)(1U) 
                                       + vlSelf->__VactIterCount);
            vlSelf->__VactContinue = 0U;
            if (Vtest___024root___eval_phase__act(vlSelf)) {
                vlSelf->__VactContinue = 1U;
            }
        }
        if (Vtest___024root___eval_phase__nba(vlSelf)) {
            __VnbaContinue = 1U;
        }
    }
}

#ifdef VL_DEBUG
void Vtest___024root___eval_debug_assertions(Vtest___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root___eval_debug_assertions\n"); );
}
#endif  // VL_DEBUG
