"""Testes do sync_repo.py contra os roteiros reais do repo.  Rodar: python -m unittest plataforma/scripts/test_sync_repo.py"""
import os, sys, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sync_repo as s


class TestSync(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.eps, cls.fatos = s.ler()
        cls.por_slug = {e['slug']: e for e in cls.eps}

    def test_todos_os_roteiros(self):
        n = len([f for f in os.listdir(os.path.join(s.RAIZ, 'roteiros')) if f.endswith('.md')])
        self.assertEqual(len(self.eps), n)

    def test_episodio_numerado(self):
        e = self.por_slug['ep15-medicina']
        self.assertEqual((e['ep'], e['numero'], e['serie'], e['tema']), ('15', 15, 'shorts', 'Medicina'))
        self.assertEqual(e['titulo'], 'Medicina: arranhão, vidro, bala e infecção (B42) | Project Zomboid')
        self.assertIn('med-vidro', e['fatos'])
        self.assertIsNone(e['youtube_id'])  # "(link do Drive...)" não é id
        self.assertEqual(e['arquivo'], 'roteiros/ep15-medicina.md')

    def test_serie_bases(self):
        e = self.por_slug['bases-01-quartel-rosewood']
        self.assertEqual((e['serie'], e['numero'], e['fatos']), ('bases', None, []))

    def test_status_valido(self):
        self.assertTrue(all(e['status'] in s.STATUS for e in self.eps))

    def test_fatos_dos_roteiros_validados_existem(self):
        ids = {f['id'] for f in self.fatos}
        for e in self.eps:
            if e['status'] in ('validado', 'aprovado'):
                self.assertFalse(set(e['fatos']) - ids, e['slug'])

    def test_sql(self):
        q = s.sql(self.eps, self.fatos)
        self.assertTrue(q.startswith('begin;') and q.rstrip().endswith('commit;'))
        self.assertEqual(q.count('on conflict'), 2)


if __name__ == '__main__':
    unittest.main()
