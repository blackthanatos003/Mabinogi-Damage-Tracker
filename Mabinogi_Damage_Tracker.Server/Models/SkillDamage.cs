namespace Mabinogi_Damage_Tracker
{
    public class SkillDamage
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; }
        public double TotalDamage { get; set; }
        public int HitCount { get; set; }
        public double Percentage { get; set; }
        public double MaxHit { get; set; }

        public SkillDamage() { }
    }
}
