import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Wallet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/hooks/use-toast";

type TransactionType = "expense" | "income" | "transfer";

const EXPENSE_CATEGORIES = [
  "餐費",
  "固定支出",
  "雜項支出",
  "快樂費用",
  "交通費用",
  "副業基金",
];

const INCOME_CATEGORIES = [
  "薪資",
  "贊助",
  "獎金",
  "發票彩卷中獎",
  "其他",
];

const TRANSFER_CATEGORIES = [
  "繳信用卡費",
  "儲值悠遊卡",
  "帳戶互轉",
  "領現金",
];

const ACCOUNTS = ["現金", "CUBE 卡", "悠遊卡", "中信 LINE PAY 卡", "國泰世華", "中國信託", "元大銀行"];

const ExpenseForm = () => {
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : type === "income" ? INCOME_CATEGORIES : TRANSFER_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "transfer") {
      if (!account || !toAccount || !amount) {
        toast({
          title: "欄位遺漏",
          description: "請填寫來源帳戶、目標帳戶和金額。",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!category || !account || !amount) {
        toast({
          title: "欄位遺漏",
          description: "請填寫類別、帳戶和金額。",
          variant: "destructive",
        });
        return;
      }
    }

    // 發送資料到 Google Forms
    const formId = "1FAIpQLSdmuus93aoHwnhjNPIVwkpC9mR8jQeCxWY7qnsBS3nUGXAdkg";
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    
    // 建立隱藏的 form 元素
    const form = document.createElement("form");
    form.method = "POST";
    form.action = formUrl;
    form.target = "hidden_iframe";
    
    // 準備表單資料
    const formData: { [key: string]: string } = {
      "entry.1775997719": format(date, "yyyy-MM-dd"), // 日期
      "entry.1623709542": category, // 類型（填入類別或項目名稱）
      "entry.156449285": description, // 備註
    };

    // 根據類型填入不同欄位
    if (type === "expense") {
      formData["entry.1685282936"] = amount; // 支出（只填金額）
      formData["entry.786246798"] = account; // 目標帳戶
    } else if (type === "income") {
      formData["entry.1411269491"] = amount; // 收入（只填金額）
      formData["entry.786246798"] = account; // 目標帳戶
    } else if (type === "transfer") {
      formData["entry.780784969"] = amount; // 移轉（只填金額）
      formData["entry.1412670614"] = account; // 來源帳戶
      formData["entry.786246798"] = toAccount; // 目標帳戶
    }

    // 建立並附加 input 欄位
    Object.entries(formData).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    // 建立隱藏的 iframe（如果不存在）
    let iframe = document.getElementById("hidden_iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "hidden_iframe";
      iframe.name = "hidden_iframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    // 提交表單
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    toast({
      title: `${type === "expense" ? "支出" : type === "income" ? "收入" : "移轉"}已儲存！`,
      description: type === "transfer" 
        ? `${format(date, "PPP")} — ${account} → ${toAccount} — $${amount}`
        : `${format(date, "PPP")} — ${category} — $${amount}`,
    });
    setCategory("");
    setAccount("");
    setToAccount("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-md">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AssetsTracker
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Developed by DlsuMtStyle 2026
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-6 flex gap-2 rounded-xl bg-secondary p-1.5">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategory(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-4 text-base font-semibold transition-all duration-200",
              type === "expense"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowDownCircle className="h-5 w-5" />
            支出
          </button>
          <button
            type="button"
            onClick={() => { setType("income"); setCategory(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-4 text-base font-semibold transition-all duration-200",
              type === "income"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowUpCircle className="h-5 w-5" />
            收入
          </button>
          <button
            type="button"
            onClick={() => { setType("transfer"); setCategory(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-4 text-base font-semibold transition-all duration-200",
              type === "transfer"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeftRight className="h-5 w-5" />
            移轉
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Amount — hero field */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">$</span>
              <input
                id="amount"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 border-none bg-transparent text-center text-5xl font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-base py-5",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {date ? format(date, "PPP") : "選擇日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">
              {type === "transfer" ? "項目" : "類別"}
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full text-base py-5">
                <SelectValue placeholder={type === "transfer" ? "選擇項目" : "選擇類別"} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">
              {type === "transfer" ? "來源帳戶" : "帳戶"}
            </Label>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-full text-base py-5">
                <SelectValue placeholder={type === "transfer" ? "選擇來源帳戶" : "選擇帳戶"} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {ACCOUNTS.map((acc) => (
                  <SelectItem key={acc} value={acc}>
                    {acc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Account (only for transfer) */}
          {type === "transfer" && (
            <div className="space-y-2">
              <Label className="text-base font-medium text-foreground">目標帳戶</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger className="w-full text-base py-5">
                  <SelectValue placeholder="選擇目標帳戶" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {ACCOUNTS.map((acc) => (
                    <SelectItem key={acc} value={acc}>
                      {acc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-base font-medium text-foreground">
              <FileText className="mr-1 inline h-4 w-4" />
              備註
            </Label>
            <Textarea
              placeholder="新增描述..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px] resize-none text-base"
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={cn(
              "w-full py-6 text-xl font-semibold shadow-md transition-all duration-200",
              type === "expense"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            儲存{type === "expense" ? "支出" : type === "income" ? "收入" : "移轉"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
