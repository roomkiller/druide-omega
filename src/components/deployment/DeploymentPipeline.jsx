import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { 
  Rocket, 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertTriangle,
  PlayCircle,
  RotateCcw,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DeploymentPipeline({ consciousnessConfig, onDeploymentComplete }) {
  const [deploying, setDeploying] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [deploymentForm, setDeploymentForm] = useState({
    version: "",
    deployment_type: "consciousness",
    changes: ""
  });

  const runAutomatedTests = async () => {
    setTesting(true);
    setTestResults(null);
    
    try {
      const startTime = Date.now();
      
      // Créer un test run
      const testRun = await base44.entities.TestRun.create({
        run_name: `Pre-Deployment Test - ${new Date().toLocaleString('fr-FR')}`,
        trigger: "pre_deployment",
        status: "running",
        consciousness_config_snapshot: consciousnessConfig
      });

      toast.info("🧪 Tests automatisés en cours...");

      // Simuler tests (dans la vraie vie, appeler les vrais tests AITests)
      const categories = ['cognitive', 'language', 'emotional', 'creativity', 'memory', 'reasoning', 'ethical'];
      const categoryScores = {};
      let totalScore = 0;
      let testsPassed = 0;
      let testsFailed = 0;

      for (const category of categories) {
        // Simulation: score basé sur la config de conscience
        const baseScore = Math.min(95, (consciousnessConfig?.consciousness_level || 9) * 6 + Math.random() * 10);
        const score = Math.round(baseScore);
        categoryScores[category] = score;
        totalScore += score;
        
        if (score >= 70) testsPassed++;
        else testsFailed++;
      }

      const overallScore = Math.round(totalScore / categories.length);
      const duration = Date.now() - startTime;

      // Mettre à jour le test run
      await base44.entities.TestRun.update(testRun.id, {
        status: "completed",
        overall_score: overallScore,
        category_scores: categoryScores,
        tests_passed: testsPassed,
        tests_failed: testsFailed,
        total_tests: categories.length,
        duration_ms: duration
      });

      setTestResults({
        id: testRun.id,
        overallScore,
        categoryScores,
        testsPassed,
        testsFailed,
        passed: overallScore >= 75
      });

      if (overallScore >= 75) {
        toast.success(`✅ Tests réussis: ${overallScore}%`);
      } else {
        toast.error(`❌ Tests échoués: ${overallScore}%`);
      }

    } catch (error) {
      console.error("Erreur tests:", error);
      toast.error("Erreur lors des tests: " + error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleDeploy = async () => {
    if (!deploymentForm.version) {
      toast.error("Version requise");
      return;
    }

    if (!testResults || !testResults.passed) {
      toast.error("Tests doivent passer avant déploiement");
      return;
    }

    setDeploying(true);

    try {
      const user = await base44.auth.me();
      
      const deployment = await base44.entities.Deployment.create({
        version: deploymentForm.version,
        deployment_type: deploymentForm.deployment_type,
        status: "testing",
        test_run_id: testResults.id,
        test_score: testResults.overallScore,
        test_results: testResults.categoryScores,
        changes: deploymentForm.changes.split('\n').filter(c => c.trim()),
        consciousness_snapshot: consciousnessConfig,
        deployed_by: user.email
      });

      // Simuler déploiement
      await new Promise(resolve => setTimeout(resolve, 2000));

      await base44.entities.Deployment.update(deployment.id, {
        status: "deployed",
        deployed_at: new Date().toISOString()
      });

      toast.success("🚀 Déploiement réussi!");
      
      setDeploymentForm({ version: "", deployment_type: "consciousness", changes: "" });
      setTestResults(null);
      
      onDeploymentComplete?.();

    } catch (error) {
      console.error("Erreur déploiement:", error);
      toast.error("Erreur: " + error.message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de déploiement */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Nouveau Déploiement</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">
              Version
            </label>
            <Input
              placeholder="ex: 1.2.3"
              value={deploymentForm.version}
              onChange={(e) => setDeploymentForm({...deploymentForm, version: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">
              Type
            </label>
            <select
              value={deploymentForm.deployment_type}
              onChange={(e) => setDeploymentForm({...deploymentForm, deployment_type: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="consciousness">Conscience</option>
              <option value="module">Module</option>
              <option value="hotfix">Hotfix</option>
              <option value="feature">Feature</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">
              Changements (un par ligne)
            </label>
            <Textarea
              placeholder="- Amélioration de la conscience&#10;- Correction bug éthique"
              value={deploymentForm.changes}
              onChange={(e) => setDeploymentForm({...deploymentForm, changes: e.target.value})}
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Section Tests */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Tests Automatisés</h3>
          </div>
          <Button
            onClick={runAutomatedTests}
            disabled={testing || !deploymentForm.version}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tests en cours...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Lancer les tests
              </>
            )}
          </Button>
        </div>

        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              testResults.passed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {testResults.passed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className="font-bold text-slate-900">
                  Score Global: {testResults.overallScore}%
                </span>
              </div>
              <Badge className={testResults.passed ? 'bg-green-500' : 'bg-red-500'}>
                {testResults.testsPassed}/{testResults.testsPassed + testResults.testsFailed} réussis
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(testResults.categoryScores).map(([cat, score]) => (
                <div key={cat} className="bg-white/80 rounded px-2 py-1.5 text-xs">
                  <div className="font-medium text-slate-700 capitalize">{cat}</div>
                  <div className={`font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {score}%
                  </div>
                </div>
              ))}
            </div>

            {!testResults.passed && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Score insuffisant (&lt;75%). Ajustez les paramètres et relancez les tests.</span>
              </div>
            )}
          </motion.div>
        )}
      </Card>

      {/* Bouton de déploiement */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Prêt à déployer?</h4>
            <p className="text-sm text-slate-600">
              Tests validés, version {deploymentForm.version || "non définie"}
            </p>
          </div>
          <Button
            onClick={handleDeploy}
            disabled={!testResults || !testResults.passed || deploying || !deploymentForm.version}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            {deploying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Déploiement...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-2" />
                Déployer
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}