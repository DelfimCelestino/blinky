"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Calendar as CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";

// Types
interface Income {
  id: string;
  amount: number;
  source: string;
  date: Date;
  savingsPercentage: number;
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
  priority: "low" | "medium" | "high";
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

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // New state for form inputs
  const [newIncome, setNewIncome] = useState<Omit<Income, "id">>({
    amount: 0,
    source: "",
    date: new Date(),
    savingsPercentage: 0,
  });
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    amount: 0,
    category: "",
    description: "",
    date: new Date(),
  });
  const [newSavingsGoal, setNewSavingsGoal] = useState<
    Omit<SavingsGoal, "id" | "currentAmount">
  >({
    name: "",
    targetAmount: 0,
    priority: "medium",
  });

  useEffect(() => {
    fetchData();

    setSelectedMonth(format(new Date(), "yyyy-MM"));
  }, [searchParams]);

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
      id: Date.now().toString(),
      ...newIncome,
      date: newIncome.date || new Date(),
    };
    incomeData.push(addedIncome);
    localStorage.setItem("income", JSON.stringify(incomeData));
    setIncome((prevIncome) => [...prevIncome, addedIncome]);
    setShowIncomeDialog(false);
    toast({
      title: "Renda adicionada",
      description: "Sua nova renda foi adicionada com sucesso. 💰",
    });
  };

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expensesData = JSON.parse(localStorage.getItem("expenses") || "[]");
    const addedExpense = {
      id: Date.now().toString(),
      ...newExpense,
      date: newExpense.date || new Date(),
    };
    expensesData.push(addedExpense);
    localStorage.setItem("expenses", JSON.stringify(expensesData));
    setExpenses((prevExpenses) => [...prevExpenses, addedExpense]);
    setShowExpenseDialog(false);
    toast({
      title: "Despesa adicionada",
      description: "Sua nova despesa foi adicionada com sucesso. 📝",
    });
  };

  const addSavingsGoal = (
    newGoal: Omit<SavingsGoal, "id" | "currentAmount">
  ) => {
    const savingsGoalsData = JSON.parse(
      localStorage.getItem("savingsGoals") || "[]"
    );
    const addedGoal = {
      id: Date.now().toString(),
      ...newGoal,
      currentAmount: 0,
    };
    savingsGoalsData.push(addedGoal);
    localStorage.setItem("savingsGoals", JSON.stringify(savingsGoalsData));
    setSavingsGoals((prevGoals) => [...prevGoals, addedGoal]);
    setShowSavingsGoalDialog(false);
    toast({
      title: "Meta de economia adicionada",
      description: "Sua nova meta de economia foi adicionada com sucesso. 🎯",
    });
  };

  const deleteIncome = (id: string) => {
    const incomeData = JSON.parse(localStorage.getItem("income") || "[]");
    const updatedIncome = incomeData.filter((item: Income) => item.id !== id);
    localStorage.setItem("income", JSON.stringify(updatedIncome));
    setIncome(updatedIncome);
    toast({
      title: "Renda removida",
      description: "A renda foi removida com sucesso. ❌",
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
      description: "A despesa foi removida com sucesso. ❌",
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
      description: "A meta de economia foi removida com sucesso. ❌",
    });
  };

  const filteredIncome = income.filter((item) => {
    const itemDate = new Date(item.date);
    const filterDate = parse(selectedMonth, "yyyy-MM", new Date());
    return (
      itemDate >= startOfMonth(filterDate) && itemDate <= endOfMonth(filterDate)
    );
  });

  const filteredExpenses = expenses.filter((item) => {
    const itemDate = new Date(item.date);
    const filterDate = parse(selectedMonth, "yyyy-MM", new Date());
    return (
      itemDate >= startOfMonth(filterDate) && itemDate <= endOfMonth(filterDate)
    );
  });

  const totalIncome = filteredIncome.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalExpenses = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalSavings = filteredIncome.reduce(
    (sum, item) => sum + (item.amount * item.savingsPercentage) / 100,
    0
  );
  const balance = totalIncome - totalExpenses - totalSavings;

  const chartData = [
    { name: "Renda", amount: totalIncome },
    { name: "Despesas", amount: totalExpenses },
    { name: "Poupança", amount: totalSavings },
    { name: "Saldo", amount: balance },
  ];

  const simulateGoalWithSavings = (goal: SavingsGoal) => {
    const remainingAmount = goal.targetAmount - balance;
    if (remainingAmount <= 0)
      return {
        canAchieve: true,
        savingsImpact: 0,
        remainingSavings: totalSavings,
      };

    if (remainingAmount <= totalSavings) {
      const savingsImpact = (remainingAmount / totalSavings) * 100;
      return {
        canAchieve: true,
        savingsImpact,
        remainingSavings: totalSavings - remainingAmount,
      };
    }

    return { canAchieve: false, savingsImpact: 100, remainingSavings: 0 };
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto p-2 md:p-4 space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
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
              <p className="text-lg md:text-3xl font-bold text-white">
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
              <p className="text-lg md:text-3xl font-bold text-white">
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
              <p className="text-lg md:text-3xl font-bold text-white">
                ${balance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-400 to-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="mr-2" />
                Poupança Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-3xl font-bold text-white">
                ${totalSavings.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap space-x-2 md:space-x-4  border-b">
          {["overview", "income-expenses", "savings"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-2 md:px-4 text-xs md:text-sm font-medium leading-5 focus:outline-none transition-all duration-300 ${
                activeTab === tab
                  ? "border-b-2 border-primary"
                  : "hover:border-b-2 hover:border-gray-300"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "overview" && "Visão Geral"}
              {tab === "income-expenses" && "Renda e Despesas"}
              {tab === "savings" && "Metas de Economia"}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
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
                  const { canAchieve, savingsImpact, remainingSavings } =
                    simulateGoalWithSavings(goal);

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 p-3 md:p-4 rounded-lg shadow-md"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-0">
                          {goal.name}
                        </h2>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            goal.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : goal.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {goal.priority.charAt(0).toUpperCase() +
                            goal.priority.slice(1)}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        max={100}
                        className="h-2 mb-2"
                        color={
                          progress >= 100
                            ? "bg-green-400"
                            : progress >= 50
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }
                      />
                      <p className="text-xs md:text-sm mb-2">
                        Progresso: {progress.toFixed(2)}% (Meta: $
                        {goal.targetAmount.toFixed(2)}, Atual: $
                        {balance.toFixed(2)})
                      </p>
                      {canAchieve ? (
                        <p className="text-green-600 text-xs md:text-sm">
                          Você pode alcançar esta meta! 🎉 Impacto na poupança:{" "}
                          {savingsImpact.toFixed(2)}%
                        </p>
                      ) : (
                        <p className="text-red-600 text-xs md:text-sm">
                          Meta não alcançável com o saldo e poupança atuais. 😕
                        </p>
                      )}
                      {savingsImpact > 50 && (
                        <p className="text-yellow-600 text-xs md:text-sm mt-1">
                          ⚠️ Atenção: Usar mais de 50% da poupança pode não ser
                          aconselhável para metas não essenciais.
                        </p>
                      )}
                      <p className="text-blue-600 text-xs md:text-sm mt-1">
                        Poupança restante após atingir a meta: $
                        {remainingSavings.toFixed(2)}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
          {activeTab === "income-expenses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Renda e Despesas</h2>
                <Select
                  value={selectedMonth}
                  onValueChange={(value) => setSelectedMonth(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) =>
                      Array.from({ length: 12 }, (_, month) => {
                        const date = new Date(year, month, 1);
                        return (
                          <SelectItem
                            key={`${year}-${month}`}
                            value={format(date, "yyyy-MM")}
                          >
                            {format(date, "MMMM yyyy", { locale: ptBR })}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Renda
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-zinc-50"
                        onClick={() => setShowIncomeDialog(true)}
                      >
                        <Plus className="mr-2" /> Adicionar Renda
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      <ul className="space-y-2">
                        {(showFullIncomeList
                          ? filteredIncome
                          : filteredIncome.slice(-3)
                        ).map((item) => (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 border-b last:border-b-0"
                          >
                            <div className="mb-2 md:mb-0">
                              <span className="font-medium block md:inline">
                                {item.source}
                              </span>
                              <span className="text-xs md:text-sm text-muted-foreground block md:inline md:ml-2">
                                {format(item.date, "d 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                              <span className="font-bold text-sm md:text-base">
                                ${item.amount.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.savingsPercentage}% poupança
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteIncome(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                    <Button
                      variant="link"
                      onClick={() => setShowFullIncomeList((prev) => !prev)}
                      className="mt-4"
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
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Despesas
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-zinc-50"
                        onClick={() => setShowExpenseDialog(true)}
                      >
                        <Plus className="mr-2" /> Adicionar Despesa
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      <ul className="space-y-2">
                        {(showFullExpenseList
                          ? filteredExpenses
                          : filteredExpenses.slice(-3)
                        ).map((item) => (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 border-b last:border-b-0"
                          >
                            <div className="mb-2 md:mb-0">
                              <span className="font-medium block md:inline">
                                {item.category}
                              </span>
                              <span className="text-xs md:text-sm text-muted-foreground block md:inline md:ml-2">
                                {format(item.date, "d 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                              <span className="font-bold text-sm md:text-base text-red-500">
                                -${item.amount.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteExpense(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                    <Button
                      variant="link"
                      onClick={() => setShowFullExpenseList((prev) => !prev)}
                      className="mt-4"
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
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
          {activeTab === "savings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Metas de Economia
                    <Button
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-zinc-50"
                      onClick={() => setShowSavingsGoalDialog(true)}
                    >
                      <Plus className="mr-2" /> Adicionar Meta
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {savingsGoals.map((goal) => {
                      const progress = (balance / goal.targetAmount) * 100;
                      const { canAchieve, savingsImpact, remainingSavings } =
                        simulateGoalWithSavings(goal);

                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="mb-4 p-3 md:p-4 rounded-lg shadow-md"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-0">
                              {goal.name}
                            </h2>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                goal.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : goal.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {goal.priority.charAt(0).toUpperCase() +
                                goal.priority.slice(1)}
                            </span>
                          </div>
                          <Progress
                            value={progress}
                            max={100}
                            className="h-2 mb-2"
                            color={
                              progress >= 100
                                ? "bg-green-400"
                                : progress >= 50
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }
                          />
                          <p className="text-xs md:text-sm mb-2">
                            Progresso: {progress.toFixed(2)}% (Meta: $
                            {goal.targetAmount.toFixed(2)}, Atual: $
                            {balance.toFixed(2)})
                          </p>
                          {canAchieve ? (
                            <p className="text-green-600 text-xs md:text-sm">
                              Você pode alcançar esta meta! 🎉 Impacto na
                              poupança: {savingsImpact.toFixed(2)}%
                            </p>
                          ) : (
                            <p className="text-red-600 text-xs md:text-sm">
                              Meta não alcançável com o saldo e poupança atuais.
                              😕
                            </p>
                          )}
                          {savingsImpact > 50 && (
                            <p className="text-yellow-600 text-xs md:text-sm mt-1">
                              ⚠️ Atenção: Usar mais de 50% da poupança pode não
                              ser aconselhável para metas não essenciais.
                            </p>
                          )}
                          <p className="text-blue-600 text-xs md:text-sm mt-1">
                            Poupança restante após atingir a meta: $
                            {remainingSavings.toFixed(2)}
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSavingsGoal(goal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Income Dialog */}
      <Dialog open={showIncomeDialog} onOpenChange={setShowIncomeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Renda</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova renda abaixo.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addIncome(newIncome);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid  gap-4">
                <Label htmlFor="amount" className="text-left">
                  Valor
                </Label>
                <Input
                  id="amount"
                  type="number"
                  className="col-span-3 w-full"
                  value={newIncome.amount}
                  onChange={(e) =>
                    setNewIncome({
                      ...newIncome,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="source" className="text-left">
                  Fonte
                </Label>
                <Input
                  id="source"
                  className="col-span-3 w-full"
                  value={newIncome.source}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, source: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="date" className="text-left">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`col-span-3 justify-start text-left font-normal ${
                        !newIncome.date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newIncome.date ? (
                        format(newIncome.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newIncome.date}
                      onSelect={(date) =>
                        setNewIncome({ ...newIncome, date: date || new Date() })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="savingsPercentage" className="text-left">
                  Porcentagem de Poupança
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Slider
                    id="savingsPercentage"
                    min={0}
                    max={100}
                    step={1}
                    value={[newIncome.savingsPercentage]}
                    onValueChange={(value) =>
                      setNewIncome({
                        ...newIncome,
                        savingsPercentage: value[0],
                      })
                    }
                  />
                  <span>{newIncome.savingsPercentage}%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar Renda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Despesa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova despesa abaixo.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addExpense(newExpense);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid  gap-4">
                <Label htmlFor="amount" className="text-left">
                  Valor
                </Label>
                <Input
                  id="amount"
                  type="number"
                  className="col-span-3 w-full"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="category" className="text-left">
                  Categoria
                </Label>
                <Input
                  id="category"
                  className="col-span-3 w-full"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="description" className="text-left">
                  Descrição
                </Label>
                <Input
                  id="description"
                  className="col-span-3 w-full"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="date" className="text-left">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`col-span-3 justify-start text-left font-normal ${
                        !newExpense.date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newExpense.date ? (
                        format(newExpense.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newExpense.date}
                      onSelect={(date) =>
                        setNewExpense({
                          ...newExpense,
                          date: date || new Date(),
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar Despesa</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Savings Goal Dialog */}
      <Dialog
        open={showSavingsGoalDialog}
        onOpenChange={setShowSavingsGoalDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Meta de Economia</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua nova meta de economia abaixo.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSavingsGoal(newSavingsGoal);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid  gap-4">
                <Label htmlFor="name" className="text-left">
                  Nome
                </Label>
                <Input
                  id="name"
                  className="col-span-3 w-full"
                  value={newSavingsGoal.name}
                  onChange={(e) =>
                    setNewSavingsGoal({
                      ...newSavingsGoal,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="targetAmount" className="text-left">
                  Valor Alvo
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  className="col-span-3 w-full"
                  value={newSavingsGoal.targetAmount}
                  onChange={(e) =>
                    setNewSavingsGoal({
                      ...newSavingsGoal,
                      targetAmount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid  gap-4">
                <Label htmlFor="priority" className="text-left">
                  Prioridade
                </Label>
                <Select
                  value={newSavingsGoal.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewSavingsGoal({ ...newSavingsGoal, priority: value })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Adicionar Meta de Economia</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
}
