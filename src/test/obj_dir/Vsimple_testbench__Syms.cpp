// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Symbol table implementation internals

#include "Vsimple_testbench__pch.h"
#include "Vsimple_testbench.h"
#include "Vsimple_testbench___024root.h"

// FUNCTIONS
Vsimple_testbench__Syms::~Vsimple_testbench__Syms()
{
}

Vsimple_testbench__Syms::Vsimple_testbench__Syms(VerilatedContext* contextp, const char* namep, Vsimple_testbench* modelp)
    : VerilatedSyms{contextp}
    // Setup internal state of the Syms class
    , __Vm_modelp{modelp}
    // Setup module instances
    , TOP{this, namep}
{
        // Check resources
        Verilated::stackCheck(23);
    // Configure time unit / time precision
    _vm_contextp__->timeunit(-9);
    _vm_contextp__->timeprecision(-12);
    // Setup each module's pointers to their submodules
    // Setup each module's pointer back to symbol table (for public functions)
    TOP.__Vconfigure(true);
}
