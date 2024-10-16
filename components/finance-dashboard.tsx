"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  DollarSign,
  CreditCard,
  Target,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Income {
  id: string;
  amount: number;
  source: string;
  date: Date;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function FinanceDashboard() {
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showSavingsGoalDialog, setShowSavingsGoalDialog] = useState(false);
  const [showFullIncomeList, setShowFullIncomeList] = useState(false);
  const [showFullExpenseList, setShowFullExpenseList] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const incomeData = JSON.parse(localStorage.getItem("income") || "[]");
    const expensesData = JSON.parse(localStorage.getItem("expenses") || "[]");
    const savingsGoalsData = JSON.parse(
      localStorage.getItem("savingsGoals") || "[]"
    );

    const incomeWithDates = incomeData.map((item: Income) => ({
      ...item,
      date: new Date(item.date),
    }));

    const expensesWithDates = expensesData.map((item: Expense) => ({
      ...item,
      date: new Date(item.date),
    }));

    setIncome(incomeWithDates);
    setExpenses(expensesWithDates);
    setSavingsGoals(savingsGoalsData);
    setLoading(false);
  };

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const incomeData = JSON.parse(localStorage.getItem("income") || "[]");
    const addedIncome = {
      id: Date.now().toString(), // Gerar um ID único
      ...newIncome,
      date: new Date(newIncome.date),
    };
    incomeData.push(addedIncome);
    localStorage.setItem("income", JSON.stringify(incomeData));
    setIncome(incomeData);
    setShowIncomeDialog(false);
    toast({
      title: "Renda adicionada",
      description: "Sua nova renda foi adicionada com sucesso.",
    });
  };

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expensesData = JSON.parse(localStorage.getItem("expenses") || "[]");
    const addedExpense = {
      id: Date.now().toString(), // Gerar um ID único
      ...newExpense,
      date: new Date(newExpense.date),
    };
    expensesData.push(addedExpense);
    localStorage.setItem("expenses", JSON.stringify(expensesData));
    setExpenses(expensesData);
    setShowExpenseDialog(false);
    toast({
      title: "Despesa adicionada",
      description: "Sua nova despesa foi adicionada com sucesso.",
    });
  };

  const addSavingsGoal = (
    newGoal: Omit<SavingsGoal, "id" | "currentAmount">
  ) => {
    const savingsGoalsData = JSON.parse(
      localStorage.getItem("savingsGoals") || "[]"
    );
    const addedGoal = {
      id: Date.now().toString(), // Gerar um ID único
      ...newGoal,
      currentAmount: 0,
    };
    savingsGoalsData.push(addedGoal);
    localStorage.setItem("savingsGoals", JSON.stringify(savingsGoalsData));
    setSavingsGoals(savingsGoalsData);
    setShowSavingsGoalDialog(false);
    toast({
      title: "Meta de economia adicionada",
      description: "Sua nova meta de economia foi adicionada com sucesso.",
    });
  };

  const deleteIncome = (id: string) => {
    const incomeData = JSON.parse(localStorage.getItem("income") || "[]");
    const updatedIncome = incomeData.filter((item: Income) => item.id !== id);
    localStorage.setItem("income", JSON.stringify(updatedIncome));
    setIncome(updatedIncome);
    toast({
      title: "Renda removida",
      description: "A renda foi removida com sucesso.",
    });
  };

  const deleteExpense = (id: string) => {
    const expensesData = JSON.parse(localStorage.getItem("expenses") || "[]");
    const updatedExpenses = expensesData.filter(
      (item: Expense) => item.id !== id
    );
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    toast({
      title: "Despesa removida",
      description: "A despesa foi removida com sucesso.",
    });
  };

  const deleteSavingsGoal = (id: string) => {
    const savingsGoalsData = JSON.parse(
      localStorage.getItem("savingsGoals") || "[]"
    );
    const updatedGoals = savingsGoalsData.filter(
      (item: SavingsGoal) => item.id !== id
    );
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
    setSavingsGoals(updatedGoals);
    toast({
      title: "Meta de economia removida",
      description: "A meta de economia foi removida com sucesso.",
    });
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const chartData = [
    { name: "Renda", amount: totalIncome },
    { name: "Despesas", amount: totalExpenses },
    { name: "Saldo", amount: balance },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-green-400 to-green-600">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="mr-2" />
                Renda Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                ${totalIncome.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-400 to-red-600">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CreditCard className="mr-2" />
                Despesas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                ${totalExpenses.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-400 to-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Target className="mr-2" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                ${balance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="income-expenses">Renda e Despesas</TabsTrigger>
          <TabsTrigger value="savings">Metas de Economia</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <AnimatePresence>
            {savingsGoals.map((goal) => {
              const progress = (balance / goal.targetAmount) * 100;
              const alertMessage =
                balance >= goal.targetAmount
                  ? "Você pode comprar esse item."
                  : null;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 rounded-lg"
                >
                  <h1>Suas metas:</h1>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{goal.name}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavingsGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Progress
                    value={progress}
                    max={100}
                    className="h-2 mt-2"
                    color={
                      progress >= 100
                        ? "bg-green-400"
                        : progress >= 50
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }
                  />
                  <p className="text-sm mt-1">
                    Progresso: {progress.toFixed(2)}% (Meta: $
                    {goal.targetAmount.toFixed(2)}, Atual: ${balance.toFixed(2)}
                    )
                  </p>
                  {alertMessage && (
                    <p className="text-green-500 text-sm mt-1">
                      {alertMessage}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </TabsContent>
        <TabsContent value="income-expenses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Renda
                  <Dialog
                    open={showIncomeDialog}
                    onOpenChange={setShowIncomeDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-zinc-50"
                      >
                        <Plus className="mr-2" /> Adicionar Renda
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Renda</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const amount = parseFloat(form.amount.value);
                          const source = form.source.value;
                          const date = new Date(form.date.value);
                          addIncome({ amount, source, date });
                        }}
                      >
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Valor
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="number"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                              Fonte
                            </Label>
                            <Input
                              id="source"
                              name="source"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Data
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit">Adicionar Renda</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  <ul>
                    {(showFullIncomeList ? income : income.slice(-3)).map(
                      (item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-between items-center mb-2 p-2 rounded"
                        >
                          <span>{item.source}</span>
                          <span>${item.amount.toFixed(2)}</span>
                          <span>{item.date.toLocaleDateString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteIncome(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.li>
                      )
                    )}
                  </ul>
                </AnimatePresence>
                <span
                  onClick={() => setShowFullIncomeList((prev) => !prev)}
                  className="text-blue-500 cursor-pointer flex items-center mt-2"
                >
                  {showFullIncomeList ? (
                    <>
                      <ChevronUp className="mr-1" /> Ver Menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1" /> Ver Lista Completa
                    </>
                  )}
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Despesas
                  <Dialog
                    open={showExpenseDialog}
                    onOpenChange={setShowExpenseDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-zinc-50"
                      >
                        <Plus className="mr-2" /> Adicionar Despesa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Despesa</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const amount = parseFloat(form.amount.value);
                          const category = form.category.value;
                          const description = form.description.value;
                          const date = new Date(form.date.value);
                          addExpense({ amount, category, description, date });
                        }}
                      >
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Valor
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="number"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Categoria
                            </Label>
                            <Input
                              id="category"
                              name="category"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Descrição
                            </Label>
                            <Input
                              id="description"
                              name="description"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Data
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit">Adicionar Despesa</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  <ul>
                    {(showFullExpenseList ? expenses : expenses.slice(-3)).map(
                      (item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex justify-between items-center mb-2 p-2 rounded"
                        >
                          <span>{item.category}</span>
                          <span>${item.amount.toFixed(2)}</span>
                          <span>{item.date.toLocaleDateString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteExpense(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.li>
                      )
                    )}
                  </ul>
                </AnimatePresence>
                <span
                  onClick={() => setShowFullExpenseList((prev) => !prev)}
                  className="text-blue-500 cursor-pointer flex items-center mt-2"
                >
                  {showFullExpenseList ? (
                    <>
                      <ChevronUp className="mr-1" /> Ver Menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1" /> Ver Lista Completa
                    </>
                  )}
                </span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Metas de Economia
                <Dialog
                  open={showSavingsGoalDialog}
                  onOpenChange={setShowSavingsGoalDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-zinc-50"
                    >
                      <Plus className="mr-2" /> Adicionar Meta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Meta de Economia</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const name = form.goalName.value;
                        const targetAmount = parseFloat(
                          form.targetAmount.value
                        );
                        addSavingsGoal({ name, targetAmount });
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="goalName" className="text-right">
                            Nome
                          </Label>
                          <Input
                            id="goalName"
                            name="goalName"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="targetAmount" className="text-right">
                            Valor da Meta
                          </Label>
                          <Input
                            id="targetAmount"
                            name="targetAmount"
                            type="number"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Adicionar Meta</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {savingsGoals.map((goal) => {
                  const progress = (balance / goal.targetAmount) * 100;
                  const alertMessage =
                    balance >= goal.targetAmount
                      ? "Você pode comprar esse item."
                      : null;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{goal.name}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSavingsGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Progress
                        value={progress}
                        max={100}
                        className="h-2 mt-2"
                        color={
                          progress >= 100
                            ? "bg-green-400"
                            : progress >= 50
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }
                      />
                      <p className="text-sm mt-1">
                        Progresso: {progress.toFixed(2)}% (Meta: $
                        {goal.targetAmount.toFixed(2)}, Atual: $
                        {balance.toFixed(2)})
                      </p>
                      {alertMessage && (
                        <p className="text-green-500 text-sm mt-1">
                          {alertMessage}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
}
