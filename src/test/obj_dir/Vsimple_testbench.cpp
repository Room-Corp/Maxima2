// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Model implementation (design independent parts)

#include "Vsimple_testbench__pch.h"

//============================================================
// Constructors

Vsimple_testbench::Vsimple_testbench(VerilatedContext* _vcontextp__, const char* _vcname__)
    : VerilatedModel{*_vcontextp__}
    , vlSymsp{new Vsimple_testbench__Syms(contextp(), _vcname__, this)}
    , rootp{&(vlSymsp->TOP)}
{
    // Register model with the context
    contextp()->addModel(this);
}

Vsimple_testbench::Vsimple_testbench(const char* _vcname__)
    : Vsimple_testbench(Verilated::threadContextp(), _vcname__)
{
}

//============================================================
// Destructor

Vsimple_testbench::~Vsimple_testbench() {
    delete vlSymsp;
}

//============================================================
// Evaluation function

#ifdef VL_DEBUG
void Vsimple_testbench___024root___eval_debug_assertions(Vsimple_testbench___024root* vlSelf);
#endif  // VL_DEBUG
void Vsimple_testbench___024root___eval_static(Vsimple_testbench___024root* vlSelf);
void Vsimple_testbench___024root___eval_initial(Vsimple_testbench___024root* vlSelf);
void Vsimple_testbench___024root___eval_settle(Vsimple_testbench___024root* vlSelf);
void Vsimple_testbench___024root___eval(Vsimple_testbench___024root* vlSelf);

void Vsimple_testbench::eval_step() {
    VL_DEBUG_IF(VL_DBG_MSGF("+++++TOP Evaluate Vsimple_testbench::eval_step\n"); );
#ifdef VL_DEBUG
    // Debug assertions
    Vsimple_testbench___024root___eval_debug_assertions(&(vlSymsp->TOP));
#endif  // VL_DEBUG
    vlSymsp->__Vm_deleter.deleteAll();
    if (VL_UNLIKELY(!vlSymsp->__Vm_didInit)) {
        vlSymsp->__Vm_didInit = true;
        VL_DEBUG_IF(VL_DBG_MSGF("+ Initial\n"););
        Vsimple_testbench___024root___eval_static(&(vlSymsp->TOP));
        Vsimple_testbench___024root___eval_initial(&(vlSymsp->TOP));
        Vsimple_testbench___024root___eval_settle(&(vlSymsp->TOP));
    }
    VL_DEBUG_IF(VL_DBG_MSGF("+ Eval\n"););
    Vsimple_testbench___024root___eval(&(vlSymsp->TOP));
    // Evaluate cleanup
    Verilated::endOfEval(vlSymsp->__Vm_evalMsgQp);
}

//============================================================
// Events and timing
bool Vsimple_testbench::eventsPending() { return !vlSymsp->TOP.__VdlySched.empty(); }

uint64_t Vsimple_testbench::nextTimeSlot() { return vlSymsp->TOP.__VdlySched.nextTimeSlot(); }

//============================================================
// Utilities

const char* Vsimple_testbench::name() const {
    return vlSymsp->name();
}

//============================================================
// Invoke final blocks

void Vsimple_testbench___024root___eval_final(Vsimple_testbench___024root* vlSelf);

VL_ATTR_COLD void Vsimple_testbench::final() {
    Vsimple_testbench___024root___eval_final(&(vlSymsp->TOP));
}

//============================================================
// Implementations of abstract methods from VerilatedModel

const char* Vsimple_testbench::hierName() const { return vlSymsp->name(); }
const char* Vsimple_testbench::modelName() const { return "Vsimple_testbench"; }
unsigned Vsimple_testbench::threads() const { return 1; }
void Vsimple_testbench::prepareClone() const { contextp()->prepareClone(); }
void Vsimple_testbench::atClone() const {
    contextp()->threadPoolpOnClone();
}
