// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vsimple_testbench.h for the primary calling header

#include "Vsimple_testbench__pch.h"
#include "Vsimple_testbench__Syms.h"
#include "Vsimple_testbench___024root.h"

void Vsimple_testbench___024root___ctor_var_reset(Vsimple_testbench___024root* vlSelf);

Vsimple_testbench___024root::Vsimple_testbench___024root(Vsimple_testbench__Syms* symsp, const char* v__name)
    : VerilatedModule{v__name}
    , __VdlySched{*symsp->_vm_contextp__}
    , vlSymsp{symsp}
 {
    // Reset structure values
    Vsimple_testbench___024root___ctor_var_reset(this);
}

void Vsimple_testbench___024root::__Vconfigure(bool first) {
    (void)first;  // Prevent unused variable warning
}

Vsimple_testbench___024root::~Vsimple_testbench___024root() {
}
