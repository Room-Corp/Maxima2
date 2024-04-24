// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Model implementation (design independent parts)

#include "Vexample__pch.h"
#include "verilated_vcd_sc.h"

//============================================================
// Constructors

Vexample::Vexample(sc_core::sc_module_name /* unused */)
    : VerilatedModel{*Verilated::threadContextp()}
    , vlSymsp{new Vexample__Syms(contextp(), name(), this)}
    , rootp{&(vlSymsp->TOP)}
{
    // Register model with the context
    contextp()->addModel(this);
    contextp()->traceBaseModelCbAdd(
        [this](VerilatedTraceBaseC* tfp, int levels, int options) { traceBaseModel(tfp, levels, options); });
    // Sensitivities on all clocks and combinational inputs
    SC_METHOD(eval);
    SC_METHOD(eval_sens);

}

//============================================================
// Destructor

Vexample::~Vexample() {
    delete vlSymsp;
}

//============================================================
// Evaluation function

#ifdef VL_DEBUG
void Vexample___024root___eval_debug_assertions(Vexample___024root* vlSelf);
#endif  // VL_DEBUG
void Vexample___024root___eval_static(Vexample___024root* vlSelf);
void Vexample___024root___eval_initial(Vexample___024root* vlSelf);
void Vexample___024root___eval_settle(Vexample___024root* vlSelf);
void Vexample___024root___eval(Vexample___024root* vlSelf);

void Vexample::eval() {
    eval_step();
    if (eventsPending()) {
        sc_core::sc_time dt = sc_core::sc_time::from_value(nextTimeSlot() - contextp()->time());
        next_trigger(dt, trigger_eval);
    } else {
        next_trigger(trigger_eval);
    }
}

void Vexample::eval_sens() {
    trigger_eval.notify();
}

void Vexample::eval_step() {
    VL_DEBUG_IF(VL_DBG_MSGF("+++++TOP Evaluate Vexample::eval_step\n"); );
#ifdef VL_DEBUG
    // Debug assertions
    Vexample___024root___eval_debug_assertions(&(vlSymsp->TOP));
#endif  // VL_DEBUG
    vlSymsp->__Vm_activity = true;
    vlSymsp->__Vm_deleter.deleteAll();
    if (VL_UNLIKELY(!vlSymsp->__Vm_didInit)) {
        vlSymsp->__Vm_didInit = true;
        VL_DEBUG_IF(VL_DBG_MSGF("+ Initial\n"););
        Vexample___024root___eval_static(&(vlSymsp->TOP));
        Vexample___024root___eval_initial(&(vlSymsp->TOP));
        Vexample___024root___eval_settle(&(vlSymsp->TOP));
    }
    VL_DEBUG_IF(VL_DBG_MSGF("+ Eval\n"););
    Vexample___024root___eval(&(vlSymsp->TOP));
    // Evaluate cleanup
    Verilated::endOfEval(vlSymsp->__Vm_evalMsgQp);
}

//============================================================
// Events and timing
bool Vexample::eventsPending() { return !vlSymsp->TOP.__VdlySched.empty(); }

uint64_t Vexample::nextTimeSlot() { return vlSymsp->TOP.__VdlySched.nextTimeSlot(); }

//============================================================
// Utilities

//============================================================
// Invoke final blocks

void Vexample___024root___eval_final(Vexample___024root* vlSelf);

VL_ATTR_COLD void Vexample::final() {
    Vexample___024root___eval_final(&(vlSymsp->TOP));
}

//============================================================
// Implementations of abstract methods from VerilatedModel

const char* Vexample::hierName() const { return vlSymsp->name(); }
const char* Vexample::modelName() const { return "Vexample"; }
unsigned Vexample::threads() const { return 1; }
void Vexample::prepareClone() const { contextp()->prepareClone(); }
void Vexample::atClone() const {
    contextp()->threadPoolpOnClone();
}
std::unique_ptr<VerilatedTraceConfig> Vexample::traceConfig() const {
    return std::unique_ptr<VerilatedTraceConfig>{new VerilatedTraceConfig{false, false, false}};
};

//============================================================
// Trace configuration

void Vexample___024root__trace_decl_types(VerilatedVcd* tracep);

void Vexample___024root__trace_init_top(Vexample___024root* vlSelf, VerilatedVcd* tracep);

VL_ATTR_COLD static void trace_init(void* voidSelf, VerilatedVcd* tracep, uint32_t code) {
    // Callback from tracep->open()
    Vexample___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vexample___024root*>(voidSelf);
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (!vlSymsp->_vm_contextp__->calcUnusedSigs()) {
        VL_FATAL_MT(__FILE__, __LINE__, __FILE__,
            "Turning on wave traces requires Verilated::traceEverOn(true) call before time 0.");
    }
    vlSymsp->__Vm_baseCode = code;
    tracep->pushPrefix(std::string{vlSymsp->name()}, VerilatedTracePrefixType::SCOPE_MODULE);
    Vexample___024root__trace_decl_types(tracep);
    Vexample___024root__trace_init_top(vlSelf, tracep);
    tracep->popPrefix();
}

VL_ATTR_COLD void Vexample___024root__trace_register(Vexample___024root* vlSelf, VerilatedVcd* tracep);

VL_ATTR_COLD void Vexample::traceBaseModel(VerilatedTraceBaseC* tfp, int levels, int options) {
    if (!sc_core::sc_get_curr_simcontext()->elaboration_done()) {
        vl_fatal(__FILE__, __LINE__, name(), "Vexample::trace() is called before sc_core::sc_start(). Run sc_core::sc_start(sc_core::SC_ZERO_TIME) before trace() to complete elaboration.");
    }(void)levels; (void)options;
    VerilatedVcdC* const stfp = dynamic_cast<VerilatedVcdC*>(tfp);
    if (VL_UNLIKELY(!stfp)) {
        vl_fatal(__FILE__, __LINE__, __FILE__,"'Vexample::trace()' called on non-VerilatedVcdC object;"
            " use --trace-fst with VerilatedFst object, and --trace with VerilatedVcd object");
    }
    stfp->spTrace()->addModel(this);
    stfp->spTrace()->addInitCb(&trace_init, &(vlSymsp->TOP));
    Vexample___024root__trace_register(&(vlSymsp->TOP), stfp->spTrace());
}
